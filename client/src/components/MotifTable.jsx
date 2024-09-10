import iconPC from "/src/assets/icon-protein-clique.svg";
import iconCoregTFs from "/src/assets/icon-coreg-tfs.svg";
import iconFFL from "/src/assets/icon-feed-fwd-loop.svg";
import iconCoregProteins from "/src/assets/icon-coreg-proteins.svg";
import iconMFL from "/src/assets/icon-mixed-feedback-loop.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function MotifTable({
    motifCount,
    e,
    z,
    p
}) {
    const TooltipIcon = ({ icon, alt, tooltipContent, tooltipId }) => (
        <div>
            <img
                src={icon}
                alt={alt}
                className="motif-icon"
                data-tooltip-id={tooltipId}
            />
            <ReactTooltip
                id={tooltipId}
                place="top"
                content={tooltipContent}
                effect="float"
            />
        </div>
    );

    return (
        <div className="motif-table">
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Motif</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>#</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}><i>E</i> ratio</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}><i>Z</i>-score</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}><i>p</i>-value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            <TooltipIcon
                                icon={iconPC}
                                alt="Protein Clique Icon"
                                tooltipId="tooltipPC"
                                tooltipContent="Protein Clique"
                            />
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{motifCount[0] || 0}</td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof e.ePC === 'number' ? (e.ePC === 0 ? 'N/A' : e.ePC.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof z.zPC === 'number' ? (z.zPC === 0 ? 'N/A' : z.zPC.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof p.pPC === 'number' ? (p.pPC === 0 ? 'N/A' : p.pPC.toFixed(4)) : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            <TooltipIcon
                                icon={iconCoregTFs}
                                alt="Interacting Transcription Factors Icon"
                                tooltipId="tooltipCoregTFs"
                                tooltipContent="Interacting Coregulating TFs"
                            />
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{motifCount[1] || 0}</td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof e.eCoregTFs === 'number' ? (e.eCoregTFs === 0 ? 'N/A' : e.eCoregTFs.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof z.zCoregTFs === 'number' ? (z.zCoregTFs === 0 ? 'N/A' : z.zCoregTFs.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof p.pCoregTFs === 'number' ? (p.pCoregTFs === 0 ? 'N/A' : p.pCoregTFs.toFixed(4)) : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            <TooltipIcon
                                icon={iconFFL}
                                alt="Feed Forward Loop Icon"
                                tooltipId="tooltipFFL"
                                tooltipContent="Feed Forward Loop"
                            />
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{motifCount[2] || 0}</td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof e.eFFL === 'number' ? (e.eFFL === 0 ? 'N/A' : e.eFFL.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof z.zFFL === 'number' ? (z.zFFL === 0 ? 'N/A' : z.zFFL.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof p.pFFL === 'number' ? (p.pFFL === 0 ? 'N/A' : p.pFFL.toFixed(4)) : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            <TooltipIcon
                                icon={iconCoregProteins}
                                alt="Coregulating Interacting Proteins Icon"
                                tooltipId="tooltipCoregProteins"
                                tooltipContent="Coregulating Interacting Proteins"
                            />
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{motifCount[3] || 0}</td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof e.eCoregProteins === 'number' ? (e.eCoregProteins === 0 ? 'N/A' : e.eCoregProteins.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof z.zCoregProteins === 'number' ? (z.zCoregProteins === 0 ? 'N/A' : z.zCoregProteins.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof p.pCoregProteins === 'number' ? (p.pCoregProteins === 0 ? 'N/A' : p.pCoregProteins.toFixed(4)) : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            <TooltipIcon
                                icon={iconMFL}
                                alt="Mixed Feedback Loop Icon"
                                tooltipId="tooltipMFL"
                                tooltipContent="Mixed Feedback Loop"
                            />
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>{motifCount[4] || 0}</td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof e.eMFL === 'number' ? (e.eMFL === 0 ? 'N/A' : e.eMFL.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof z.zMFL === 'number' ? (z.zMFL === 0 ? 'N/A' : z.zMFL.toFixed(4)) : 'N/A'}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {typeof p.pMFL === 'number' ? (p.pMFL === 0 ? 'N/A' : p.pMFL.toFixed(4)) : 'N/A'}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

