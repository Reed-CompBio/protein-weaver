var parseString = require('xml2js').parseString;
var fs = require('fs');

// Read the XML content from the file
var xml = fs.readFileSync('./zfish_psicquic_results.xml', { encoding: 'utf8' });

// Initialize an array to store all interactors
const interactorsData = [];

// Parse the XML content
parseString(xml, function (err, result) {
    if (err) {
        console.error('Error parsing XML:', err);
    } else {
        const json = result;
        const entries = json.entrySet;

        entries.entry.forEach((entry, index) => {
            console.log(`Appending Entry ${index + 1}...`);

            // Accessing interactor data
            const interactorList = entry.interactorList[0];
            const interactors = interactorList.interactor;

            interactors.forEach((interactor, interactorIndex) => {
                const interactorData = {
                    ID: interactor.$.id,
                    Names: interactor.names[0],
                    Xref: interactor.xref[0],
                    InteractorType: interactor.interactorType[0],
                    Organism: interactor.organism[0],
                };

                interactorsData.push(interactorData); // Append the interactor data to the global array
            });
        });

        // Now, outside of the loop, you have all interactors from all entries in interactorsData
        const jsonInteractors = JSON.stringify(interactorsData, null, 2);
        fs.writeFileSync('interactors.json', jsonInteractors);
        console.log('Interactor data saved to interactors_test.json');
    }
});
