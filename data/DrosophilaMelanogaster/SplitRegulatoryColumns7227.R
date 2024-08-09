library(tidyverse)

# delete the first few rows and last row and remove the (s) from the column headers before importing
reg_7227 <- read_tsv('~/Desktop/GitHub_Repos/protein-weaver/data/DrosophilaMelanogaster/gene_genetic_interactions_fb_2024_03.tsv')
head(reg_7227)

reg_7227 <- reg_7227 %>%
  separate_longer_delim(c(Starting_gene_symbol, Starting_gene_FBgn), delim = "|") %>% 
  separate_longer_delim(c(Interacting_gene_symbol, Interacting_gene_FBgn), delim = "|")

write_tsv(reg_7227, '~/Desktop/GitHub_Repos/protein-weaver/data/DrosophilaMelanogaster/regulatory_txid7227_2024-07-31.txt')