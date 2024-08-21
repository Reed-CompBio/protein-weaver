const parseString = require('xml2js').parseString;
const fs = require('fs');

// Read the XML content from the file
const xml = fs.readFileSync('./zfish_psicquic_results.xml', { encoding: 'utf8' });

// Initialize an array to store all experiments
const experimentsData = [];

// Parse the XML content
parseString(xml, (err, result) => {
    if (err) {
        console.error('Error parsing XML:', err);
        return;
    }

    const entries = result.entrySet.entry;

    entries.forEach((entry, index) => {
        console.log(`Appending Entry ${index + 1}...`);

        // Accessing experiment data
        const experimentList = entry.experimentList[0];
        const experiments = experimentList.experimentDescription;

        experiments.forEach((experiment, experimentIndex) => {
            const experimentData = {
                ID: experiment.$.id,
                Author: experiment.names[0].shortLabel[0],
                PrimaryReference: {
                    Database: experiment.bibref[0].xref[0].primaryRef[0].$.db,
                    Link: experiment.bibref[0].xref[0].primaryRef[0].$.id
                }
            };

            experimentsData.push(experimentData); // Append the experiment data to the global array
        });
    });

    // Convert the results array to a JSON string
    const jsonExperiments = JSON.stringify(experimentsData, null, 2);

    // Write the JSON string to a file
    fs.writeFileSync('experiments.json', jsonExperiments);
    console.log('Experiment data saved to experiments.json');
});
