library(tidyverse)

# getting ProPro data
at_ppi_path <- "Desktop/ProteinWeaver/ArabidopsisThaliana/BIOGRID-ORGANISM-Arabidopsis_thaliana_Columbia-4.4.246.tab3.txt"
at_df <-read.csv(at_ppi_path, header = TRUE, sep = "\t", quote = "")

at_ppi <- at_df %>% select(Systematic.Name.Interactor.A, Systematic.Name.Interactor.B,
                           Official.Symbol.Interactor.A, Official.Symbol.Interactor.B,
                           Synonyms.Interactor.A, Synonyms.Interactor.B,
                           Experimental.System.Type, Publication.Source
                          )
at_ppi <- at_ppi %>% filter(Experimental.System.Type == "physical")
colnames(at_ppi) <- c("id1", "id2", "name1", "name2", "synonym1", "synonym2",  "type", "pubmed")

# remove duplicate A-->B and B-->A edges for undirected PPI
df <- data.frame(id1 = pmin(at_ppi$id1, at_ppi$id2), id2 = pmax(at_ppi$id1, at_ppi$id2))
df$name1 <- at_ppi$name1
df$name2 <- at_ppi$name2
df$synonym1 <- at_ppi$synonym1
df$synonym2 <- at_ppi$synonym2
df$pubmed <- at_ppi$pubmed
at_ppi2 <- df[!duplicated(df[, c("id1", "id2")]), ]

# parse the synonyms and PubMed IDs
at_ppi <- at_ppi2 %>%
  mutate(synonym1 = str_split(synonym1, "\\|", simplify = TRUE)[, 1])

at_ppi <- at_ppi %>%
  mutate(synonym2 = str_split(synonym2, "\\|", simplify = TRUE)[, 1])

at_ppi <- at_ppi %>%
  mutate(pubmed = sub("PUBMED:", "", pubmed))

at_ppi <- at_ppi %>% 
  mutate(source = "biogrid")

# get list of protein names to get SwissProt IDs
combined_protein_ppi <- c(at_ppi2$id1,at_ppi2$id2)
unique_ppi_proteins <- unique(combined_protein_ppi)

# getting Reg data
at_reg_path <- "Desktop/ProteinWeaver/ArabidopsisThaliana/Regulations_in_ATRM.csv"
at_reg <- read_csv(at_reg_path)
colnames(at_reg) <- c("tf_id", "target_id", "tf_name", "target_name", "activate/repress", "pubmed")
at_reg <- at_reg %>% select(tf_id,  target_id, tf_name, target_name, `activate/repress`, pubmed)
at_reg <- at_reg %>% 
  mutate(source = "atrm")

# separate all PubMed IDs by semicolon
at_reg$pubmed <- gsub(", ", ";", at_reg$pubmed)

# Get list of gene/TF names to get SwissProt IDs
combined_reg_ids <- c(at_reg$tf_id,at_reg$target_id)
unique_reg_ids <- unique(combined_reg_ids)
unique_ids <- c(unique_ppi_proteins, unique_reg_ids)
unique_ids <- unique(unique_ids) %>% tibble()
# write.table(unique_ids, "Desktop/ProteinWeaver/ArabidopsisThaliana/atg_unique_ids.txt", sep = "\t", row.names = FALSE, col.names = FALSE, quote = FALSE)

# merge in UniProt IDs to datasets
uniprot_ids <- "Desktop/ProteinWeaver/ArabidopsisThaliana/uniprot_mapping_txid3702.tsv"
uniprot_ids <- read_tsv(uniprot_ids)
id_mapping <- tibble(uniprot_ids$From, uniprot_ids$Entry)
colnames(id_mapping) <- c("id", "uniprot_id")

# add in first set of PPI IDs
at_ppi <- left_join(at_ppi, id_mapping, by = c("id1" = "id")) %>% rename(uniprot_id1 = uniprot_id)
# add in second set of PPI IDs
at_ppi <- left_join(at_ppi, id_mapping, by = c("id2" = "id")) %>% rename(uniprot_id2 = uniprot_id)

# add in TF IDs
at_reg <- left_join(at_reg, id_mapping, by = c("tf_id" = "id")) %>% rename(tf_uniprot_id = uniprot_id)
# add in target IDs
at_reg <- left_join(at_reg, id_mapping, by = c("target_id" = "id")) %>% rename(target_uniprot_id = uniprot_id)

# filter to where both interactors are SwissProt verified
unverified_ppi <- at_ppi %>% filter(is.na(uniprot_id1) | is.na(uniprot_id2))
unverified_reg <- at_reg %>% filter(is.na(tf_uniprot_id) | is.na(target_uniprot_id))

at_ppi <- at_ppi %>% filter(!is.na(uniprot_id1)) %>% filter(!is.na(uniprot_id2))
at_reg <- at_reg %>% filter(!is.na(tf_uniprot_id)) %>% filter(!is.na(target_uniprot_id))

# missing # of protein mappings (2920)
nrow(unique_ids) - nrow(uniprot_ids)

# write PPI and Reg data to files
write_tsv(at_ppi, "Desktop/ProteinWeaver/ArabidopsisThaliana/interactome-txid3702-2025_06_18.txt")
write_tsv(at_reg, "Desktop/ProteinWeaver/ArabidopsisThaliana/regulatory-txid3702-2025_06_18.txt")


# getting GO annotation data
go_df <- read_tsv("Desktop/ProteinWeaver/ArabidopsisThaliana/QuickGO-annotations-1750198620452-20250617.tsv")
colnames(go_df) <- c("database", "uniprot_protein_id", "qualifier", "go_term", "go_name", "eco_id", "evidence", "reference", "aspect")
go_df <- go_df %>% select(uniprot_protein_id, go_term, qualifier)
write_tsv(go_df, "Desktop/ProteinWeaver/ArabidopsisThaliana/annotations-txid3702-2025_06_18.txt")