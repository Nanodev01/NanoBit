export interface PhotoItem {
  id: string;
  title: string;
  location: string;
  category: "Paisaje" | "Urbano" | "Naturaleza" | "Noche";
  imageUrl: string;
  cameraInfo?: string;
  date?: string;
}

export const galleryConfig = {
  title: "/lente",
  subtitle: "Fotografía & Perspectiva Visual — Cuando no estoy frente al código",
  description: "Una selección de capturas de paisajes, viajes y arquitectura. El ojo para el detalle, la composición y la luz también forja mi enfoque en la arquitectura de software.",
  instagramUrl: "https://instagram.com",
};

export const samplePhotos: PhotoItem[] = [];
