const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function fetchItemsFromAPI(category: string) {
  const url = `https://eldenring.fanapis.com/api/${category}?limit=999`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    const data = await response.json();

    // Check if data and data.data are defined and data.data is an array
    if (data && data.data && Array.isArray(data.data)) {
      const items = data.data;

      // Affichage de chaque item individuellement
      items.forEach((item: { id: string; name: string; description: string; image: string; type: string; effect: string; }) => {
        console.log('ID:', item.id);
        console.log('Nom:', item.name);
        console.log('Description:', item.description);
        console.log('Image:', item.image);
        console.log('Type:', item.type);
        console.log('Effect:', item.effect);
        console.log('---------------------');

        // Création du contenu du fichier .md
        const mdContent = `# ${item.name}\n\n![Image](${item.image})\n\n${item.description}\n\nType: ${item.type}\n\nEffect: ${item.effect}\n\n`;

        // Écriture du contenu dans un fichier .md
        const fileName = `${item.name.replace(/\s+/g, '_')}.md`; // Remplace les espaces par des underscores
        const dirPath = path.join(__dirname, 'dist', category);
        const filePath = path.join(dirPath, fileName);

        // Création du dossier s'il n'existe pas
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        try {
          fs.writeFileSync(filePath, mdContent);
          console.log(`Fichier ${fileName} créé avec succès dans le dossier ${dirPath}.`);
        } catch (error) {
          console.error(`Erreur lors de l'écriture du fichier ${fileName} :`, error);
        }
      });
    } else {
      console.log('data.data is undefined or not an array');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

// Liste des catégories à parcourir
const categories = ['ammos', 'armors', 'ashes', 'bosses', 'classes', 'creatures', 'incantations', 'items', 'locations', 'npcs', 'shields', 'sorceries', 'spirits', 'talismans', 'weapons'];

// Appel de la fonction pour chaque catégorie
categories.forEach(category => fetchItemsFromAPI(category));