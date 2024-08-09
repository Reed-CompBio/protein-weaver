const parseString = require('xml2js').parseString;
const fs = require('fs');

// Read the XML content from the file
const xml = fs.readFileSync('./zfish_psicquic_results.xml', { encoding: 'utf8' });

const results = [];

// Parse the XML content
parseString(xml, function (err, result) {
    if (err) {
        console.error('Error parsing XML:', err);
    } else {
        // This code should be inside the callback to ensure it runs after parsing
        const json = result;
        const entries = json.entrySet;

        entries.entry.forEach((entry, index) => {
            console.log(`Appending Entry ${index + 1}...`);

            // Accessing source data
            const source = entry.source[0];
            const sourceNames = source.names[0];
            const sourceXref = source.xref[0];

            // Accessing experiment data
            const experimentList = entry.experimentList[0];
            const experimentDescription = experimentList.experimentDescription[0];

            // Accessing interactor data
            const interactorList = entry.interactorList[0];
            const interactors = interactorList.interactor;

            // Accessing interaction data
            const interactionList = entry.interactionList[0];
            const interactions = interactionList.interaction;

            // Accessing attribute data
            const attributeList = entry.attributeList[0];
            const attributes = attributeList.attribute;

            console.log("Source:", source);
            console.log("Source Names:", sourceNames);
            console.log("Source Xref:", sourceXref);
            console.log("Experiment Description:", experimentDescription);
            console.log("Interactors:", interactors);
            console.log("Interactions:", interactions);
            console.log("Attributes:", attributes);

            interactions.forEach((interaction, interactionIndex) => {
                console.log(`Interaction ${interactionIndex + 1}:`);
                console.log("ID:", interaction.$.id);

                // Access other properties within the interaction object
                const names = interaction.names[0];
                const xref = interaction.xref[0];
                const experimentList = interaction.experimentList[0];
                const participantList = interaction.participantList[0];
                const interactionType = interaction.interactionType[0];
                const modelled = interaction.modelled[0];
                const intraMolecular = interaction.intraMolecular[0];
                const negative = interaction.negative[0];
                const confidenceList = interaction.confidenceList[0];
                const attributeList = interaction.attributeList[0];

                // Log other properties as needed
                console.log("Names:", names);
                console.log("Xref:", xref);
                console.log("Experiment List:", experimentList);
                console.log("Participant List:", participantList);
                console.log("Interaction Type:", interactionType);
                console.log("Modelled:", modelled);
                console.log("IntraMolecular:", intraMolecular);
                console.log("Negative:", negative);
                console.log("Confidence List:", confidenceList);
                console.log("Attribute List:", attributeList);

                const participants = participantList.participant;

                participants.forEach((participant, participantIndex) => {
                    console.log(`Participant ${participantIndex + 1}:`);

                    // Access participant properties
                    const interactorRef = participant.interactorRef;
                    const participantIdentificationMethodList = participant.participantIdentificationMethodList;
                    const biologicalRole = participant.biologicalRole;
                    const experimentalRoleList = participant.experimentalRoleList;
                    const featureList = participant.featureList;

                    // Log participant properties as needed
                    console.log("Interactor Ref:", interactorRef);
                    console.log("Participant Identification Method List:", participantIdentificationMethodList);
                    console.log("Biological Role:", biologicalRole);
                    console.log("Experimental Role List:", experimentalRoleList);
                    console.log("Feature List:", featureList);
                });

                // Create an object to store the relevant data for this interaction
                const interactionData = {
                    ID: interaction.$.id,
                    Type: interactionType.names[0].shortLabel[0],
                    Experiment: experimentList.experimentRef[0],
                    Participants: participants.map(participant => ({
                        InteractorRef: participant.interactorRef[0],
                    })),
                };

                results.push(interactionData);
            });
        });

        // Convert the results array to a JSON string
        const jsonResult = JSON.stringify(results, null, 2);

        // Write the JSON string to a file
        fs.writeFileSync('interactions.json', jsonResult);

        console.log('Data saved to interactions.json');
    }
});
