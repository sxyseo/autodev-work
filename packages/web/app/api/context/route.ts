import { NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';

export async function GET() {
  const client = createClient();
  await client.connect();

  try {
    // Fetch the most recent code analysis results with all fields
    const result = await client.sql`
      SELECT 
        id,
        path,
        content,
        title,
        description,
        source,
        language,
        "createdAt",
        "updatedAt"
      FROM "CodeAnalysis"
      ORDER BY "createdAt" DESC
      LIMIT 50
    `;

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching code analysis results:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch code analysis results',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

export async function POST(request: Request) {
  const client = createClient();
  await client.connect();

  try {
    const data = await request.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array of analysis results' },
        { status: 400 }
      );
    }

    // Validate each item in the array
    for (const item of data) {
      if (!item.path || !item.content) {
        return NextResponse.json(
          { error: 'Each item must contain path and content fields' },
          { status: 400 }
        );
      }
    }

    // Store each item in the database
    const results = [];
    for (const item of data) {
      const result = await client.sql`
        INSERT INTO "CodeAnalysis" (
          id, 
          path,
          content,
          "createdAt", 
          "updatedAt"
        ) VALUES (
          gen_random_uuid(), 
          ${item.path},
          ${item.content},
          NOW(), 
          NOW()
        ) RETURNING id
      `;
      results.push(result.rows[0].id);
    }

    return NextResponse.json({
      success: true,
      message: 'Code analysis results stored successfully',
      ids: results
    });
  } catch (error) {
    console.error('Error processing code analysis results:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process code analysis results',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
