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
      items.forEach((item: any) => {
        // Création du contenu du fichier .md
        let mdContent = `# ${item.name}\n\n![Image](${item.image})\n\n`;

        // Ajout de toutes les propriétés de l'item au contenu du fichier .md
        Object.entries(item).forEach(([key, value]) => {
          if (key !== 'name' && key !== 'image') { // On ne répète pas le nom et l'image
            if (Array.isArray(value)) {
              // Si la valeur est un tableau, on la traite différemment
              const arrayValues = value.map(obj => obj.name || obj).join(', '); // On suppose que chaque objet a une propriété 'name'
              mdContent += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${arrayValues}\n\n`;
            } else {
              mdContent += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n\n`; // Ajout de la clé et de la valeur au contenu du fichier .md
            }
          }
        });

        // Ajout du tag Obsidian à la fin du contenu du fichier .md
        mdContent += `\n\n#${category}`;

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