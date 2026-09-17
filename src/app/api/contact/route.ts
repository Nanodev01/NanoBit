import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, content } = await request.json();

    if (!name || !email || !content) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        name,
        email,
        content,
      },
    });

    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente' }, { status: 201 });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
  }
}
