import React, { useState, useEffect } from "react";
import iconPC from "/src/assets/icon-protein-clique.svg";
import iconCoregTFs from "/src/assets/icon-coreg-tfs.svg";
import iconFFL from "/src/assets/icon-feed-fwd-loop.svg";
import iconCoregProteins from "/src/assets/icon-coreg-proteins.svg";
import iconMFL from "/src/assets/icon-mixed-feedback-loop.svg";

const txidMapping = {
    "txid7227": [(1267922 / 466108), (5049 / 501168), (3706 / 35060), (3236 / 501168), (1439 / 501168)],
    "txid224308": [(43088 / 12882), (164 / 24150), (972 / 11268), (1359 / 24150), (65 / 24150)],
    "txid7955": [(319540 / 90006), (960 / 141926), (2257 / 51920), (523 / 141926), (14 / 141926)],
    "txid559292": [(1816919 / 328864), (171664 / 803494), (1036451 / 474630), (522163 / 803494), (76231 / 803494)],
    "txid6239": [(16880 / 27830), (28856 / 184276), (457362 / 156446), (82309 / 184276), (18579 / 184276)],
};

export default function MotifTab({ nodeList, query, searchExecuted }) {
    const [motifCount, setMotifCount] = useState([]);
    const [globalConstant, setGlobalConstant] = useState([]);
    const [localDegree, setLocalDegree] = useState({ ppiDegree: [], grnDegree: [], mixedDegree: [] });
    const [mu, setMu] = useState({});
    const [e, setE] = useState({});

    // Set global constants based on species (txid)
    useEffect(() => {
        const selectedConstant = txidMapping[query.species];
        if (selectedConstant) {
            setGlobalConstant(selectedConstant);
        }
    }, [query.species]);

    // Fetch local degrees when nodeList changes
    useEffect(() => {
        if (nodeList?.length) {
            fetch("/api/getLocalDegrees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nodeList }),
            })
                .then(res => res.json())
                .then(data => {
                    const degrees = {
                        ppiDegree: data.map(item => item._fields[0].low),
                        grnDegree: data.map(item => item._fields[1].low),
                        mixedDegree: data.map(item => item._fields[2].low),
                    };
                    setLocalDegree(degrees);
                })
                .catch(error => console.error("Error:", error));
        }
    }, [nodeList]);

    // Calculate Mu and E values when globalConstant, localDegree, or motifCount changes
    useEffect(() => {
        if (globalConstant.length && localDegree.ppiDegree.length) {
            const muPC = globalConstant[0] * localDegree.ppiDegree;
            const muCoregTFs = globalConstant[1] * localDegree.mixedDegree;
            const muFFL = globalConstant[2] * localDegree.grnDegree;
            const muCoregProteins = globalConstant[3] * localDegree.grnDegree;
            const muMFL = globalConstant[4] * localDegree.grnDegree;

            setMu({ muPC, muCoregTFs, muFFL, muCoregProteins, muMFL });

            setE({
                ePC: motifCount[0] / muPC,
                eCoregTFs: motifCount[1] / muCoregTFs,
                eFFL: motifCount[2] / muFFL,
                eCoregProteins: motifCount[3] / muCoregProteins,
                eMFL: motifCount[4] / muMFL,
            });
        }
    }, [globalConstant, localDegree, motifCount]);

    // Fetch motif counts when nodeList changes
    useEffect(() => {
        if (nodeList?.length) {
            fetch("/api/getMotif", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nodeList }),
            })
                .then(res => res.json())
                .then(data => {
                    const counts = data.map(item => item._fields[0].low);
                    setMotifCount(counts);
                })
                .catch(error => console.error("Error:", error));
        }
    }, [nodeList]);

    return (
        <div className="motif-stats-container">
            <MotifItem icon={iconPC} label="Protein clique" motifCount={motifCount[0]} e={e.ePC} />
            <MotifItem icon={iconCoregTFs} label="Interacting transcription factors" motifCount={motifCount[1]} e={e.eCoregTFs} />
            <MotifItem icon={iconFFL} label="Feed forward loop" motifCount={motifCount[2]} e={e.eFFL} />
            <MotifItem icon={iconCoregProteins} label="Coregulating interacting proteins" motifCount={motifCount[3]} e={e.eCoregProteins} />
            <MotifItem icon={iconMFL} label="Mixed feedback loop" motifCount={motifCount[4]} e={e.eMFL} />
        </div>
    );
}

function MotifItem({ icon, label, motifCount, e, mu }) {
    return (
        <div className="motif-item">
            <img src={icon} alt={`${label} Icon`} className="motif-icon" />
            <p>{label}: {motifCount || 0}</p>
            <p>E: {e || "N/A"}</p>
        </div>
    );
};