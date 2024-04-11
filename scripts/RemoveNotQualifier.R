library(tidyverse)
setwd("~/Desktop/GitHub_Repos/bio-net-viz/data/")

# Read in the datasets and get the list of unique qualifiers
go_data_7227 <- read_tsv("DrosophilaMelanogaster/dmel_GO_data_Mar15_24.tsv")
qualifiers_7227 <- unique(go_data_7227$QUALIFIER)

gene_association_fb <- read_tsv("DrosophilaMelanogaster/gene_association.fb")
qualifiers_7227 <- c(qualifiers_7227, unique(gene_association_fb$qualifier))

go_data_7955 <- read_tsv("DanioRerio/zfish_GO_data_Mar12_24.tsv")
qualifiers_7955 <- unique(go_data_7955$QUALIFIER)

go_data_224308 <- read_tsv("BacillusSubtilis/bsub_GO_data_Mar18_24.tsv")
qualifiers_224308 <- unique(go_data_224308$QUALIFIER)

qualifiers <- c(qualifiers_7227, qualifiers_7955, qualifiers_224308)

# Write out the list of unique qualifiers
qualifiers <- unique(qualifiers) %>% sort()
write_tsv(as_tibble_col(qualifiers, column_name = "qualifier"), "GeneOntology/qualifiers.tsv")


# filter and overwrite GO data based on NOT qualifiers
gene_association_fb <- gene_association_fb %>% filter(str_detect("NOT|", qualifier, negate=TRUE))
write_tsv(gene_association_fb, "DrosophilaMelanogaster/gene_association_fb_2024-04-03.tsv")

go_data_7227 <- go_data_7227 %>% filter(str_detect("NOT|", QUALIFIER, negate=TRUE))
write_tsv(go_data_7227, "DrosophilaMelanogaster/dmel_GO_data_2024-04-03.tsv")

go_data_7955 <- go_data_7955 %>% filter(str_detect("NOT|", QUALIFIER, negate=TRUE))
write_tsv(go_data_7955, "DanioRerio/zfish_GO_data_2024-04-03.tsv")

go_data_224308 <- go_data_224308 %>% filter(str_detect("NOT|", QUALIFIER, negate=TRUE))
write_tsv(go_data_224308, "BacillusSubtilis/bsub_GO_data_2024-04-03.tsv")
