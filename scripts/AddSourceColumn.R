library(tidyverse)
setwd("~/Desktop/GitHub_Repos/protein-weaver/data/Import/")

# Add source database as a column to all regulatory and physical datasets

# TXID6239
ppi_6239 <- read_tsv("elegans_ppi_2024-08-08.tsv")
ppi_6239 <- ppi_6239 %>% mutate(source = "wormbase")
write_tsv(ppi_6239, "interactome-txid6239-2024_08_19.txt")

reg_6239 <- read_tsv("elegans_reg_2024-08-08.tsv")
reg_6239 <- reg_6239 %>% mutate(source = "tf-link")
write_tsv(reg_6239, "regulatory-txid6239-2024_08_19.txt")

# TXID7227
ppi_7227 <- read_tsv("interactome-flybase-collapsed-weighted.txt")
ppi_7227 <- ppi_7227 %>% mutate(source = "flybase")
write_tsv(ppi_7227, "interactome-txid7227-2024_08_19.txt")

reg_7227 <- read_tsv("regulatory_txid7227_2024-07-31.txt")
reg_7227 <- reg_7227 %>% mutate(source = "flybase")
write_tsv(reg_7227, "regulatory-txid7227-2024_08_19.txt")

# TXID7955
ppi_7955 <- read_tsv("interactome_txid7955_2024-07-30.txt")
write_tsv(ppi_7955, "interactome-txid7955-2024_08_19.txt")
# already has source column so no further additions necessary

reg_7955 <- read_tsv("regulatory_txid7955_2024-07-31.txt")
reg_7955 <- reg_7955 %>% mutate(source = "tf-link")
write_tsv(reg_7955, "regulatory-txid7955-2024_08_19.txt")

# TXID224308
ppi_224308 <- read_tsv("interactome_txid224308_2024-07-30.txt")
write_tsv(ppi_224308, "interactome-txid224308-2024_08_19.txt")
# already has source column so no further additions necessary

reg_224308 <- read_tsv("regulatory_txid224308_2024-07-31.txt")
reg_224308 <- reg_224308 %>% mutate(source = "subtiwiki")
write_tsv(reg_224308, "regulatory-txid224308-2024_08_19.txt")

# TXID224308
ppi_559292 <- read_tsv("yeast_ppi-2024-08-08.tsv")
ppi_559292 <- ppi_559292 %>% mutate(source = "biogrid")
write_tsv(ppi_559292, "interactome-txid559292-2024_08_19.txt")

reg_559292 <- read_tsv("yeast_reg-2024-08-08.tsv")
reg_559292 <- reg_559292 %>% mutate(source = "tf-link")
write_tsv(reg_559292, "regulatory-txid559292-2024_08_19.txt")