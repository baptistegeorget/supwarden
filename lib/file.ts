// Généré avec ChatGPT

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      // Extraire le type MIME à partir de l'URL de données
      const mimeType = file.type;
      // Créer la chaîne Base64 avec l'en-tête
      const base64WithHeader = `data:${mimeType === "" ? "application/octet-stream" : mimeType};base64,${base64String.split(',')[1]}`;
      resolve(base64WithHeader);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file); // Convertir le fichier en Base64
  });
}

export function base64ToFile(base64String: string, fileName: string): File {
  // Découper la chaîne Base64 pour obtenir les données réelles
  const [header, data] = base64String.split(',');

  if (!header || !data) {
    throw new Error('La chaîne Base64 est invalide.');
  }

  // Extraire le type MIME à partir de l'en-tête
  const mimeString = header.split(':')[1].split(';')[0];

  // Décoder les données Base64 en une chaîne de caractères binaire
  const byteString = atob(data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  // Remplir l'Uint8Array avec les octets de la chaîne décodée
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  // Créer un Blob à partir de l'ArrayBuffer et du type MIME
  const blob = new Blob([arrayBuffer], { type: mimeString });

  // Créer un objet File à partir du Blob et du nom de fichier
  return new File([blob], fileName, { type: mimeString });
}