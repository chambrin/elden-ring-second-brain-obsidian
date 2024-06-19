const fs = require('fs');
const path = require('path');

// Liste des catégories à parcourir
const categories = ['ammos', 'armors', 'ashes', 'bosses', 'classes', 'creatures', 'incantations', 'items', 'locations', 'npcs', 'shields', 'sorceries', 'spirits', 'talismans', 'weapons'];

// Stocker tous les titres de tous les fichiers .md
let titles: string[] = [];
categories.forEach(category => {
    const dirPath = path.join(__dirname, 'dist', category);

    // Vérifie si le dossier existe
    if (fs.existsSync(dirPath)) {
        // Lire tous les fichiers dans le dossier
        const files = fs.readdirSync(dirPath);

        files.forEach((file: string) => {
            const filePath = path.join(dirPath, file);

            // Lire le contenu du fichier
            let content = fs.readFileSync(filePath, 'utf8');

            // Extraire le titre du contenu
            const titleMatch = content.match(/^# (.*)$/m);
            if (titleMatch) {
                titles.push(titleMatch[1]);
            }
        });
    }
});

// Parcourir à nouveau tous les fichiers et remplacer chaque occurrence d'un titre par un lien Obsidian
categories.forEach(category => {
    const dirPath = path.join(__dirname, 'dist', category);

    // Vérifie si le dossier existe
    if (fs.existsSync(dirPath)) {
        // Lire tous les fichiers dans le dossier
        const files = fs.readdirSync(dirPath);

        files.forEach((file: string) => {
            const filePath = path.join(dirPath, file);

            // Lire le contenu du fichier
            let content = fs.readFileSync(filePath, 'utf8');

            // Remplacer chaque occurrence d'un titre par un lien Obsidian
            titles.forEach((title: string) => {
                const titleWithUnderscores = title.replace(/\s+/g, '_');
                content = content.replace(new RegExp(`\\b${title}\\b`, 'g'), `[${title}](./${titleWithUnderscores}.md)`);
            });

            // Écrire le contenu modifié dans le fichier
            fs.writeFileSync(filePath, content);
        });
    }
});