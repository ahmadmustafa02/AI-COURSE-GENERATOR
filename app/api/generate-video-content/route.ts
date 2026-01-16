import { Generate_Video_Prompt } from "@/app/data/prompt";
import { client } from "@/config/groq";
import { db } from "@/config/db";
import { chapterContentSlides, chapterTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import axios from "axios";
import cloudinary from "@/config/cloudinary";
import FormData from "form-data";

export async function POST(request: NextRequest) {
  console.log('=== API Route: generate-video-content called ===');
  
  try {
    const body = await request.json();
    const {chapter, courseId} = body;

    console.log('Received courseId:', courseId);
    console.log('Received chapter:', JSON.stringify(chapter, null, 2));

    if (!chapter || !courseId) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: "Missing required fields: chapter or courseId" },
        { status: 400 }
      );
    }

    if (!chapter.chapterId) {
      console.error('Chapter missing chapterId');
      return NextResponse.json(
        { error: "Chapter must have a chapterId" },
        { status: 400 }
      );
    }

    console.log('Calling Groq API...');

    // Generate video content using AI
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: Generate_Video_Prompt },
        { role: "user", content: JSON.stringify(chapter) }
      ],
      temperature: 0.7,
    });

    console.log('Groq API response received');

    const videoContent = response.choices[0].message.content;
    
    console.log('Raw video content:', videoContent?.substring(0, 500) + '...');

    if (!videoContent) {
      console.error('No video content generated');
      return NextResponse.json(
        { error: "Failed to generate video content" },
        { status: 500 }
      );
    }

    // Clean and parse the JSON
    const cleanedContent = videoContent
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    console.log('Cleaned content (first 500 chars):', cleanedContent.substring(0, 500));

    let videoContentJson;
    try {
      videoContentJson = JSON.parse(cleanedContent);
      console.log('✅ Successfully parsed JSON');
      console.log('Parsed structure:', Array.isArray(videoContentJson) ? 'Array' : typeof videoContentJson);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Failed to parse content:', cleanedContent.substring(0, 1000));
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON", details: parseError instanceof Error ? parseError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Ensure it's an array
    const slidesArray = Array.isArray(videoContentJson) ? videoContentJson : [videoContentJson];
    console.log('Number of slides:', slidesArray.length);

    if (slidesArray.length === 0) {
      console.warn('No slides generated');
      return NextResponse.json({
        success: true,
        data: [],
        message: "No slides generated"
      });
    }

    // Save to database
    try {
      console.log('Preparing to save slides to database...');
      
      // Check if chapter exists
      console.log('Checking if chapter exists in database...');
      const existingChapter = await db.select()
        .from(chapterTable)
        .where(eq(chapterTable.chapterId, chapter.chapterId))
        .limit(1);
      
      if (existingChapter.length === 0) {
        console.log('Chapter does not exist, creating it...');
        try {
          await db.insert(chapterTable).values({
            courseId: courseId,
            chapterId: chapter.chapterId,
            chapterTitle: chapter.chapterTitle || 'Untitled Chapter',
            videoContent: videoContentJson,
            captions: null,
            audioFileUrl: null,
          });
          console.log('✅ Chapter created successfully');
        } catch (insertError: any) {
          if (insertError?.code === '23505' || insertError?.constraint?.includes('chapterId_unique')) {
            console.log('⚠️ Chapter was created by another request (race condition), continuing...');
          } else {
            console.error('❌ Unexpected error creating chapter:', insertError);
            throw insertError;
          }
        }
      } else {
        console.log('✅ Chapter already exists, skipping creation');
        
        await db.update(chapterTable)
          .set({ 
            videoContent: videoContentJson,
            chapterTitle: chapter.chapterTitle || existingChapter[0].chapterTitle
          })
          .where(eq(chapterTable.chapterId, chapter.chapterId));
        console.log('✅ Chapter updated successfully');
      }
      
      // Delete existing slides for this chapter (if regenerating)
      console.log('Checking for existing slides to delete...');
      const existingSlides = await db.select()
        .from(chapterContentSlides)
        .where(eq(chapterContentSlides.chapterId, chapter.chapterId));
      
      if (existingSlides.length > 0) {
        console.log(`Found ${existingSlides.length} existing slides, deleting them...`);
        await db.delete(chapterContentSlides)
          .where(eq(chapterContentSlides.chapterId, chapter.chapterId));
        console.log('✅ Existing slides deleted');
      }
      
      // Prepare slide records
      const slideRecords = slidesArray.map((slide: any, index: number) => {
        const record = {
          courseId: courseId,
          chapterId: chapter.chapterId,
          slideId: slide.slideId || `${chapter.chapterId}-slide-${index + 1}`,
          slideIndex: index,
          audioFileName: slide.audioFileName || `audio-${chapter.chapterId}-${index}.mp3`,
          narration: typeof slide.narration === 'object' 
            ? slide.narration 
            : { fullText: slide.narration || slide.text || "" },
          html: slide.html || "",
          revelData: Array.isArray(slide.revelData) ? slide.revelData : [],
          captions: null, // Will be updated after caption generation
        };
        
        console.log(`Slide ${index + 1} record prepared:`, {
          slideId: record.slideId,
          slideIndex: record.slideIndex,
          audioFileName: record.audioFileName,
          narrationLength: record.narration.fullText?.length || 0,
          revelDataCount: record.revelData.length
        });
        
        return record;
      });

      console.log(`Inserting ${slideRecords.length} slides into database...`);
      
      // Insert each slide individually
      let successCount = 0;
      for (const record of slideRecords) {
        try {
          await db.insert(chapterContentSlides).values(record);
          successCount++;
        } catch (slideError: any) {
          console.error(`❌ Error inserting slide ${record.slideId}:`, slideError);
        }
      }
      
      console.log(`✅ ${successCount}/${slideRecords.length} slides inserted successfully`);

      console.log('🎵 Starting audio generation...');

      // Generate audio from actual video content
      const audioUrls: string[] = [];
      const captionResults: any[] = [];
      
      for (let i = 0; i < slidesArray.length; i++) {
        const slide = slidesArray[i];
        const narration = typeof slide.narration === 'object' 
          ? slide.narration.fullText 
          : slide.narration || slide.text || "";
        const audioFileName = `audio-${chapter.chapterId}-${i}.mp3`;
        
        try {
          console.log(`\n🎬 Processing slide ${i + 1}/${slidesArray.length}...`);
          console.log(`Narration length: ${narration.length} characters`);
          
          // Skip if no narration text
          if (!narration || narration.trim() === "") {
            console.log(`⚠️ Skipping slide ${i + 1}: No narration text`);
            audioUrls.push('');
            captionResults.push(null);
            continue;
          }
          
          // Split long narration into chunks (reduced to 300 to avoid 413 errors)
          const textChunks = splitTextIntoChunks(narration, 300);
          console.log(`Split into ${textChunks.length} chunks for processing`);
          
          const audioBuffers: Buffer[] = [];
          
          // Generate audio for each chunk with retry logic
          for (let chunkIndex = 0; chunkIndex < textChunks.length; chunkIndex++) {
            const currentChunk = textChunks[chunkIndex];
            console.log(`  Processing chunk ${chunkIndex + 1}/${textChunks.length} (${currentChunk.length} chars)...`);
            
            let chunkSuccess = false;
            let retries = 0;
            const maxRetries = 3;
            
            while (!chunkSuccess && retries < maxRetries) {
              try {
                const fonadaResult = await axios.post(
                  'https://api.fonada.ai/tts/generate-audio-large',
                  {
                    input: currentChunk,
                    voice: 'Vaanee',
                    language: 'English',
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${process.env.FONDALAB_API_KEY}`
                    },
                    responseType: 'arraybuffer',
                    timeout: 120000
                  }
                );
                
                audioBuffers.push(Buffer.from(fonadaResult.data));
                console.log(`  ✅ Chunk ${chunkIndex + 1} generated`);
                chunkSuccess = true;
                
              } catch (chunkError: any) {
                retries++;
                if (axios.isAxiosError(chunkError) && chunkError.response?.status === 413) {
                  if (retries < maxRetries) {
                    console.log(`  ⚠️ Chunk ${chunkIndex + 1} failed with 413, retrying with exponential backoff (attempt ${retries}/${maxRetries})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
                  } else {
                    throw new Error(`Failed to generate audio for chunk after ${maxRetries} retries: ${chunkError.message}`);
                  }
                } else {
                  throw chunkError;
                }
              }
            }
            
            if (chunkIndex < textChunks.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          // Merge audio buffers
          const finalAudioBuffer = audioBuffers.length > 1 
            ? mergeAudioBuffers(audioBuffers)
            : audioBuffers[0];
            
          console.log(`✅ Final audio buffer: ${finalAudioBuffer.length} bytes`);
          
          // Upload to Cloudinary
          const audioUrl = await saveAudioToStorage(finalAudioBuffer, audioFileName);
          audioUrls.push(audioUrl);
          console.log(`✅ Audio uploaded: ${audioUrl}`);
          
          // 🆕 Generate captions using Groq Whisper
          console.log('📝 Generating captions with Groq Whisper...');
          let captions = null;
          try {
            captions = await generateCaptionsWithGroq(audioUrl);
            console.log(`✅ Captions generated: ${captions.chunks.length} chunks`);
            captionResults.push(captions);
          } catch (captionError) {
            console.error('⚠️ Failed to generate captions:', captionError);
            captionResults.push(null);
          }
          
          // Update the slide with audio URL and captions
          await db.update(chapterContentSlides)
            .set({ 
              audioFileName: audioUrl,
              captions: captions
            })
            .where(eq(chapterContentSlides.slideId, slideRecords[i].slideId));
          
          console.log(`✅ Slide ${i + 1} complete!\n`);
          
        } catch (audioError) {
          console.error(`❌ Error processing slide ${i + 1}:`, audioError);
          audioUrls.push('');
          captionResults.push(null);
          
          // Update database to indicate failure - set audioFileName to null
          try {
            await db.update(chapterContentSlides)
              .set({ 
                audioFileName: null,
                captions: null
              })
              .where(eq(chapterContentSlides.slideId, slideRecords[i].slideId));
            console.log(`⚠️ Updated slide ${i + 1} database record to indicate audio generation failure`);
          } catch (dbUpdateError) {
            console.error(`❌ Failed to update database for slide ${i + 1}:`, dbUpdateError);
          }
        }
      }

      console.log(`\n✅ Processing complete!`);
      console.log(`   Audio: ${audioUrls.filter(url => url).length}/${slidesArray.length} successful`);
      console.log(`   Captions: ${captionResults.filter(c => c).length}/${slidesArray.length} successful`);

      return NextResponse.json({
        success: true,
        data: videoContentJson,
        savedSlides: successCount,
        audioUrls: audioUrls,
        captions: captionResults,
        message: `Complete! ${successCount} slides, ${audioUrls.filter(url => url).length} audio files, ${captionResults.filter(c => c).length} captions generated`
      });

    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      if (dbError instanceof Error) {
        console.error('Error message:', dbError.message);
        console.error('Error stack:', dbError.stack);
      }
      
      return NextResponse.json(
        { 
          error: "Database insertion failed", 
          details: dbError instanceof Error ? dbError.message : 'Unknown database error',
          generatedContent: videoContentJson
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("❌ Error in generate-video-content API:", error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

/**
 * Generate captions using Groq Whisper API
 * Takes a Cloudinary audio URL and returns timestamped captions
 */
const generateCaptionsWithGroq = async (audioUrl: string): Promise<any> => {
  try {
    // Download audio from Cloudinary
    const audioResponse = await axios.get(audioUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    
    const audioBuffer = Buffer.from(audioResponse.data);
    console.log(`   Downloaded audio (${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
    
    // Create FormData for Groq Whisper API
    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename: 'audio.mp3',
      contentType: 'audio/mp3',
    });
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'segment');
    
    // Call Groq Whisper API directly
    const transcription = await axios.post(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        timeout: 120000
      }
    );
    
    console.log(`   Transcription received`);
    
    // Format response for your video component
    const segments = transcription.data.segments || [];
    const chunks = segments.map((segment: any) => ({
      text: segment.text.trim(),
      timestamp: [segment.start, segment.end] as [number, number]
    }));
    
    return {
      fullText: transcription.data.text,
      chunks: chunks
    };
    
  } catch (error) {
    console.error('   Whisper API error:', error);
    if (axios.isAxiosError(error)) {
      console.error('   Status:', error.response?.status);
      console.error('   Response:', error.response?.data);
    }
    throw error;
  }
};

/**
 * Upload audio buffer to Cloudinary
 */
const saveAudioToStorage = async (audioBuffer: Buffer, audioFileName: string): Promise<string> => {
  try {
    const base64Audio = audioBuffer.toString('base64');
    const dataURI = `data:audio/mp3;base64,${base64Audio}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'video',
      folder: 'course-audio',
      public_id: audioFileName.replace('.mp3', ''),
      format: 'mp3',
      overwrite: true,
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Split text into chunks
 */
const splitTextIntoChunks = (text: string, maxChars: number = 1500): string[] => {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChars) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      if (sentence.length > maxChars) {
        const words = sentence.split(' ');
        let wordChunk = '';
        for (const word of words) {
          if ((wordChunk + word).length <= maxChars) {
            wordChunk += word + ' ';
          } else {
            if (wordChunk) {
              chunks.push(wordChunk.trim());
            }
            wordChunk = word + ' ';
          }
        }
        if (wordChunk) {
          chunks.push(wordChunk.trim());
        }
      } else {
        currentChunk = sentence;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

/**
 * Merge audio buffers
 */
const mergeAudioBuffers = (buffers: Buffer[]): Buffer => {
  return Buffer.concat(buffers);
};