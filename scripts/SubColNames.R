library(tidyverse)

setwd("~/Desktop/GitHub_Repos/protein-weaver/data/")

# D. melanogaster
go_terms_7227 <- read_tsv("DrosophilaMelanogaster/QuickGO-annotations-1710535768982-20240315.tsv")
colnames(go_terms_7227) <- gsub(" ", "_", colnames(go_terms_7227))

uniprotIDs_7227 <- unique(go_terms_7227$GENE_PRODUCT_ID)
write_tsv(as_tibble(uniprotIDs_7227), "DrosophilaMelanogaster/uniprotIDs_7227_Mar15_24.tsv")

FB_ids_Mar18_24 <- read_tsv("DrosophilaMelanogaster/idmapping_2024_03_18_7227.tsv")

# join the UniProt IDs to FlyBase IDs
go_terms_7227 <- left_join(go_terms_7227, FB_ids_Mar18_24, relationship = "many-to-many")

write_tsv(go_terms_7227, "DrosophilaMelanogaster/dmel_GO_data_Mar15_24.tsv")

# B. subtilis
setwd("~/Desktop/GitHub_Repos/protein-weaver/data/")
go_terms_224308 <- read_tsv("BacillusSubtilis/QuickGO-annotations-1710796216431-20240318.tsv")
colnames(go_terms_224308) <- gsub(" ", "_", colnames(go_terms_224308))

BSU_ids_Mar18_24 <- read_tsv("BacillusSubtilis/subtiwiki.gene.export.2024-03-18.tsv") %>% select(BSU_ID, GENE_PRODUCT_ID)
go_terms_224308 <- left_join(go_terms_224308, BSU_ids_Mar18_24, relationship = "many-to-many")

write_tsv(go_terms_224308, "BacillusSubtilis/bsub_GO_data_Mar18_24.tsv")

# D. rerio
reg_7955 <- read_tsv("DanioRerio/TFLink_Danio_rerio_interactions_All_simpleFormat_v1.0.tsv")
colnames(reg_7955) <- gsub("\\.", "_", colnames(reg_7955))
write_tsv(reg_7955, "DanioRerio/regulatory_txid7955_2024-07-31.txt")