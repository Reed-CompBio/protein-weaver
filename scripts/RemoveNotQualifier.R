library(tidyverse)
# setwd("~/Desktop/GitHub_Repos/bio-net-viz/data/")

# Read in the datasets and get the list of unique qualifiers
go_data_7227 <- read_tsv("Desktop/GitHub_Repos/protein-weaver/data/DrosophilaMelanogaster/dmel_GO_data_Mar15_24.tsv")
qualifiers_7227 <- unique(go_data_7227$QUALIFIER)

gene_association_fb <- read_tsv("Desktop/GitHub_Repos/protein-weaver/data/DrosophilaMelanogaster/gene_association.fb")
qualifiers_7227 <- unique(c(qualifiers_7227, unique(gene_association_fb$qualifier)))

go_data_7955 <- read_tsv("Desktop/GitHub_Repos/protein-weaver/data/DanioRerio/zfish_GO_data_Mar12_24.tsv")
qualifiers_7955 <- unique(go_data_7955$QUALIFIER)

go_data_224308 <- read_tsv("Desktop/GitHub_Repos/protein-weaver/data/BacillusSubtilis/bsub_GO_data_Mar18_24.tsv")
qualifiers_224308 <- unique(go_data_224308$QUALIFIER)

# Second set of NOT qualifiers removed on Jun. 19, 2025
go_data_3702 <- read_tsv("Desktop/GitHub_Repos/protein-weaver/data/ArabidopsisThaliana/annotations-txid3702-2025_06_18.txt")
qualifiers_3702 <- unique(go_data_3702$qualifier)

go_data_559292 <- read_tsv("Desktop/GitHub_Repos/protein-weaver/data/SaccharomycesCerevisiae/yeast_go_annotation-2024-08-08.tsv")
qualifiers_559292 <- unique(go_data_559292$qualifier)

go_data_6239 <- read_tsv("Desktop/GitHub_Repos/protein-weaver/data/CaenorhabditisElegans/elegans_go_annotation_2024-08-08.tsv")
qualifiers_6239 <- unique(go_data_6239$rel_type)

go_data_511145 <- read_tsv("Desktop/GitHub_Repos/protein-weaver/data/EscherichiaColi/annotations-txid511145-2025_06_24.txt")
qualifiers_511145 <- unique(go_data_511145$qualifier)

qualifiers <- c(qualifiers_7227, qualifiers_7955, qualifiers_224308, qualifiers_559292, qualifiers_6239, qualifiers_3702, qualifiers_511145)


# Write out the list of unique qualifiers
qualifiers <- unique(qualifiers) %>% sort()
write_tsv(as_tibble_col(qualifiers, column_name = "qualifier"), "Desktop/GitHub_Repos/protein-weaver/data/GeneOntology/qualifiers.tsv")

# filter and overwrite GO data based on NOT qualifiers
gene_association_fb <- gene_association_fb %>% filter(str_detect("NOT|", qualifier, negate=TRUE))
write_tsv(gene_association_fb, "DrosophilaMelanogaster/gene_association_fb_2024-04-03.tsv")

go_data_7227 <- go_data_7227 %>% filter(str_detect("NOT|", QUALIFIER, negate=TRUE))
write_tsv(go_data_7227, "DrosophilaMelanogaster/dmel_GO_data_2024-04-03.tsv")

go_data_7955 <- go_data_7955 %>% filter(str_detect("NOT|", QUALIFIER, negate=TRUE))
write_tsv(go_data_7955, "DanioRerio/zfish_GO_data_2024-04-03.tsv")

go_data_224308 <- go_data_224308 %>% filter(str_detect("NOT|", QUALIFIER, negate=TRUE))
write_tsv(go_data_224308, "BacillusSubtilis/bsub_GO_data_2024-04-03.tsv")

# Second batch of species
go_data_3702 <- go_data_3702 %>% filter(str_detect("NOT|", qualifier, negate=TRUE))
write_tsv(go_data_3702, "Desktop/GitHub_Repos/protein-weaver/data/ArabidopsisThaliana/annotations-txid3702-2025_06_19.txt")

go_data_6239 <- go_data_6239 %>% filter(str_detect("NOT|", rel_type, negate=TRUE))
write_tsv(go_data_6239, "Desktop/GitHub_Repos/protein-weaver/data/CaenorhabditisElegans/annotations-txid6239-2025_06_19.txt")

go_data_559292 <- go_data_559292 %>% filter(str_detect("NOT|", qualifier, negate=TRUE))
write_tsv(go_data_559292, "Desktop/GitHub_Repos/protein-weaver/data/SaccharomycesCerevisiae/annotations-txid559292-2025_06_19.txt")

go_data_511145 <- go_data_511145 %>% filter(str_detect("NOT|", qualifier, negate=TRUE))
write_tsv(go_data_511145, "Desktop/GitHub_Repos/protein-weaver/data/EscherichiaColi/annotations-txid511145-2025_06_26.txt")
