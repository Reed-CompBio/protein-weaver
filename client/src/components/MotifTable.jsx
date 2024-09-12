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

    const getFormatted = (value) => {
        if (value === undefined || value === null || isNaN(value)) {
            return 'N/A';
        } else
            return value.toFixed(4);
    }

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
                            {getFormatted(e.ePC)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(z.zPC)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(p.pPC)}
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
                            {getFormatted(e.eCoregTFs)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(z.zCoregTFs)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(p.pCoregTFs)}
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
                            {getFormatted(e.eFFL)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(z.zMFL)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(p.pFFL)}
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
                            {getFormatted(e.eCoregProteins)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(z.zCoregProteins)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(p.pCoregProteins)}
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
                            {getFormatted(e.eMFL)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(z.zMFL)}
                        </td>
                        <td style={{ border: '1px solid black', padding: '8px' }}>
                            {getFormatted(p.pMFL)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

