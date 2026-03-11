import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    if (file.name.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: data.text });
    } else if (file.name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value });
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Parse failed" },
      { status: 500 }
    );
  }
}
