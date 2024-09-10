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
    const [e, setE] = useState({});
    const [z, setZ] = useState({});
    const [p, setP] = useState({});


    // Set global constants based on species (txid)
    // Global constant provides degree-based scaling
    useEffect(() => {
        const selectedConstant = txidMapping[query.species];
        if (selectedConstant) {
            setGlobalConstant(selectedConstant);
        }
    }, [searchExecuted]);

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
    // E = LocalMotifCount / Mu
    useEffect(() => {
        if (globalConstant.length && localDegree.ppiDegree.length) {
            const muPC = globalConstant[0] * localDegree.ppiDegree;
            const muCoregTFs = globalConstant[1] * localDegree.mixedDegree;
            const muFFL = globalConstant[2] * localDegree.grnDegree;
            const muCoregProteins = globalConstant[3] * localDegree.grnDegree;
            const muMFL = globalConstant[4] * localDegree.grnDegree;
            const zScoreCalculation = (count, mu) => mu > 0 ? (count - mu) / Math.sqrt(mu) : 0;

            // Set enrichment scores
            setE({
                ePC: motifCount[0] / muPC,
                eCoregTFs: motifCount[1] / muCoregTFs,
                eFFL: motifCount[2] / muFFL,
                eCoregProteins: motifCount[3] / muCoregProteins,
                eMFL: motifCount[4] / muMFL,
            });

            // Set Z-Scores
            setZ({
                zPC: zScoreCalculation(motifCount[0], muPC),
                zCoregTFs: zScoreCalculation(motifCount[1], muCoregTFs),
                zFFL: zScoreCalculation(motifCount[2], muFFL),
                zCoregProteins: zScoreCalculation(motifCount[3], muCoregProteins),
                zMFL: zScoreCalculation(motifCount[4], muMFL),
            });
        }
    }, [globalConstant, localDegree, motifCount]);

    // Set P-Values for each motif when Z-Scores change (only recalculate when necessary)
    useEffect(() => {
        // Function to calculate the CDF of the standard normal distribution
        function normalCDF(z) {
            return (1.0 + Math.erf(z / Math.sqrt(2))) / 2.0;
        }

        // Function to calculate the P-Value from a Z-Score for a two-tailed test
        function calculatePValue(zScore) {
            return 2 * (1 - normalCDF(Math.abs(zScore))); // Two-tailed test
        }

        if (!Math.erf) {
            Math.erf = function (x) {
                // constants
                var a1 = 0.254829592;
                var a2 = -0.284496736;
                var a3 = 1.421413741;
                var a4 = -1.453152027;
                var a5 = 1.061405429;
                var p = 0.3275911;

                // Save the sign of x
                var sign = (x >= 0) ? 1 : -1;
                x = Math.abs(x);

                // A&S formula 7.1.26
                var t = 1.0 / (1.0 + p * x);
                var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

                return sign * y;
            };
        }

        if (z.zPC !== undefined && z.zCoregTFs !== undefined && z.zFFL !== undefined && z.zCoregProteins !== undefined && z.zMFL !== undefined) {
            setP({
                pPC: calculatePValue(z.zPC),
                pCoregTFs: calculatePValue(z.zCoregTFs),
                pFFL: calculatePValue(z.zFFL),
                pCoregProteins: calculatePValue(z.zCoregProteins),
                pMFL: calculatePValue(z.zMFL),
            });
        }
    }, [z]);

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
            <MotifItem icon={iconPC} label="Protein clique" motifCount={motifCount[0]} e={e.ePC} z={z.zPC} p={p.pPC} />
            <MotifItem icon={iconCoregTFs} label="Interacting transcription factors" motifCount={motifCount[1]} e={e.eCoregTFs} z={z.zCoregTFs} p={p.pCoregTFs} />
            <MotifItem icon={iconFFL} label="Feed forward loop" motifCount={motifCount[2]} e={e.eFFL} z={z.zFFL} p={p.pFFL} />
            <MotifItem icon={iconCoregProteins} label="Coregulating interacting proteins" motifCount={motifCount[3]} e={e.eCoregProteins} z={z.zCoregProteins} p={p.pCoregProteins} />
            <MotifItem icon={iconMFL} label="Mixed feedback loop" motifCount={motifCount[4]} e={e.eMFL} z={z.zMFL} p={p.pMFL} />
        </div>
    );
}

function MotifItem({ icon, label, motifCount, e, z, p }) {
    return (
        <div className="motif-item">
            <img src={icon} alt={`${label} Icon`} className="motif-icon" />
            <p>{label}: {motifCount || 0}</p>
            <p>E: {e || "N/A"}</p>
            <p>Z: {z || "N/A"}</p>
            <p>p: {p || "N/A"}</p>
        </div>
    );
};