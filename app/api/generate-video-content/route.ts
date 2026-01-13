import { Generate_Video_Prompt } from "@/app/data/prompt";
import { client } from "@/config/groq";
import { db } from "@/config/db";
import { chapterContentSlides, chapterTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import axios from "axios";
import cloudinary from "@/config/cloudinary";

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
        // Chapter doesn't exist, create it
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
          // Check if it's a duplicate key error (race condition)
          if (insertError?.code === '23505' || insertError?.constraint?.includes('chapterId_unique')) {
            console.log('⚠️ Chapter was created by another request (race condition), continuing...');
          } else {
            // Only throw if it's NOT a duplicate key error
            console.error('❌ Unexpected error creating chapter:', insertError);
            throw insertError;
          }
        }
      } else {
        console.log('✅ Chapter already exists, skipping creation');
        
        // Update the videoContent in the existing chapter
        console.log('Updating existing chapter with new video content...');
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
          // Continue with other slides even if one fails
        }
      }
      
      console.log(`✅ ${successCount}/${slideRecords.length} slides inserted successfully`);
      console.log(`✅ Successfully saved ${successCount} slides for chapter ${chapter.chapterId}`);

      console.log('🎵 Starting audio generation...');

      // Generate audio from actual video content
      const audioUrls: string[] = [];
      
      for (let i = 0; i < slidesArray.length; i++) {
        const slide = slidesArray[i];
        const narration = typeof slide.narration === 'object' 
          ? slide.narration.fullText 
          : slide.narration || slide.text || "";
        const audioFileName = `audio-${chapter.chapterId}-${i}.mp3`;
        
        try {
          console.log(`Generating audio ${i + 1}/${slidesArray.length}...`);
          console.log(`Narration length: ${narration.length} characters`);
          
          // Skip if no narration text
          if (!narration || narration.trim() === "") {
            console.log(`⚠️ Skipping slide ${i + 1}: No narration text`);
            audioUrls.push('');
            continue;
          }
          
          // Split long narration into chunks (Fonada limit is ~2000-3000 chars)
          const textChunks = splitTextIntoChunks(narration, 2000);
          console.log(`Split into ${textChunks.length} chunks for processing`);
          
          const audioBuffers: Buffer[] = [];
          
          // Generate audio for each chunk
          for (let chunkIndex = 0; chunkIndex < textChunks.length; chunkIndex++) {
            console.log(`  Processing chunk ${chunkIndex + 1}/${textChunks.length} (${textChunks[chunkIndex].length} chars)...`);
            
            // DEBUG: Log request details
            const requestData = {
              input: textChunks[chunkIndex],
              voice: 'Vaanee',
              language: 'English',
            };
            console.log('📦 Request payload size:', JSON.stringify(requestData).length, 'bytes');
            console.log('📦 Narration text:', textChunks[chunkIndex].substring(0, 100) + '...');
            console.log('📦 API Key exists:', !!process.env.FONDALAB_API_KEY);
            console.log('📦 API Key length:', process.env.FONDALAB_API_KEY?.length || 0);
            
            const fonadaResult = await axios.post(
              'https://api.fonada.ai/tts/generate-audio-large',
              requestData,
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
            console.log(`  ✅ Chunk ${chunkIndex + 1} generated (${fonadaResult.data.byteLength} bytes)`);
            
            // Add small delay between chunks to avoid rate limiting
            if (chunkIndex < textChunks.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          // Merge all audio chunks into one buffer
          const finalAudioBuffer = audioBuffers.length > 1 
            ? mergeAudioBuffers(audioBuffers)
            : audioBuffers[0];
            
          console.log(`✅ Final audio buffer: ${finalAudioBuffer.length} bytes`);
          
          // Upload to Cloudinary
          const audioUrl = await saveAudioToStorage(finalAudioBuffer, audioFileName);
          audioUrls.push(audioUrl);
          console.log(`✅ Audio ${i + 1} uploaded successfully: ${audioUrl}`);
          
          // Update the slide with the audio URL
          await db.update(chapterContentSlides)
            .set({ audioFileName: audioUrl })
            .where(eq(chapterContentSlides.slideId, slideRecords[i].slideId));
          
        } catch (audioError) {
          console.error(`❌ Error generating/uploading audio ${i + 1}:`, audioError);
          if (axios.isAxiosError(audioError)) {
            console.error('🔍 Axios Error Details:');
            console.error('  Status:', audioError.response?.status);
            console.error('  Status Text:', audioError.response?.statusText);
            console.error('  Response Headers:', audioError.response?.headers);
            console.error('  Response Data:', audioError.response?.data);
            console.error('  Request URL:', audioError.config?.url);
            console.error('  Request Method:', audioError.config?.method);
            console.error('  Request Headers:', audioError.config?.headers);
          }
          audioUrls.push(''); // Add empty string to maintain array length
        }
      }

      console.log(`✅ Audio generation complete: ${audioUrls.filter(url => url).length}/${slidesArray.length} successful`);

      return NextResponse.json({
        success: true,
        data: videoContentJson,
        savedSlides: successCount,
        audioUrls: audioUrls,
        message: `Video content generated, ${successCount} slides saved, and ${audioUrls.filter(url => url).length} audio files uploaded successfully`
      });

    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      if (dbError instanceof Error) {
        console.error('Error message:', dbError.message);
        console.error('Error stack:', dbError.stack);
      }
      
      // Return the generated content even if DB save fails
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
 * Upload audio buffer to Cloudinary and return the secure URL
 */
const saveAudioToStorage = async (audioBuffer: Buffer, audioFileName: string): Promise<string> => {
  try {
    // Convert buffer to base64 data URI
    const base64Audio = audioBuffer.toString('base64');
    const dataURI = `data:audio/mp3;base64,${base64Audio}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'video', // Cloudinary treats audio as video resource type
      folder: 'course-audio', // Optional: organize in folders
      public_id: audioFileName.replace('.mp3', ''), // Remove extension as Cloudinary adds it
      format: 'mp3',
      overwrite: true,
    });
    
    console.log('✅ Audio uploaded to Cloudinary:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Split text into chunks based on character limit
 * Tries to split at sentence boundaries for natural speech
 */
const splitTextIntoChunks = (text: string, maxChars: number = 2000): string[] => {
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
      // If single sentence is too long, split by words
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
 * Merge multiple audio buffers into one
 */
const mergeAudioBuffers = (buffers: Buffer[]): Buffer => {
  return Buffer.concat(buffers);
};