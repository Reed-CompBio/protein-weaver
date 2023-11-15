import React from "react";
import MainLayout from "../layout/MainLayout";

export default function TOSPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <div className="about-body">
            <h2 className="about-title">Terms of Service</h2>
            <p>
              By continuing to access ProteinWeaver, you agree to the terms of
              service and privacy notice. Use this service at your own risk. Do
              not use it to share confidential information. The developers of
              ProteinWeaver are not responsible for the actions of any of the
              users on this website. We are also not responsible for any damages
              caused by using this website. Finally, it is your responsibility
              to follow appropriate academic integrity standards.
            </p>
            <p>
              The content of this project itself is licensed under the{" "}
              <a href="https://creativecommons.org/licenses/by/4.0/">
                Creative Commons CC-BY-4.0 license
              </a>
              , and the underlying source code used to format and display that
              content is licensed under the{" "}
              <a href="https://www.gnu.org/licenses/quick-guide-gplv3.html">
                GNU General Public License (GPLv3)
              </a>
              . This code was built with the{" "}
              <a href="https://neo4j.com/licensing/">Neo4J community edition</a>
              and imports data from FlyBase{" "}
              <a href="https://wiki.flybase.org/wiki/FlyBase:Downloads_Overview#Gene_Association_File_-_GAF_.28gene_association.fb.gz.29">
                (download page)
              </a>{" "}
              and the Gene Ontology{" "}
              <a href="https://geneontology.org/docs/download-ontology/">
                (download page)
              </a>
              .
            </p>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
