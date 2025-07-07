library(tidyverse)

# CREATE THE PPI DATASET
ecoli_ppi <- read.csv("Desktop/ProteinWeaver/EscherichiaColi/511145.protein.physical.links.full.v12.0.txt", header=TRUE, sep = " ")
string_names <- read.csv("Desktop/ProteinWeaver/EscherichiaColi/511145.protein.info.v12.0.txt", header=TRUE, sep = "\t")
string_ids <- read.csv("Desktop/ProteinWeaver/EscherichiaColi/511145.protein.aliases.v12.0.txt", header=TRUE, sep = "\t")

# get only the data from String-DB that has experimental, database or textmined evidence
ecoli_ppi <- ecoli_ppi %>% filter(experiments > 0 | database > 0 | textmining > 0)

ecoli_ppi <- ecoli_ppi %>% 
  mutate(
    evidence = case_when(
      experiments > 0 ~ "experimental",
      (database > 0 & experiments <= 0) ~ "database",
      (textmining > 0 & experiments <= 0 & database <= 0) ~ "textmined")
  )

# select only the relevant information
ecoli_ppi <- ecoli_ppi %>% select(protein1, protein2, evidence)

# select UniProt entries
string_ids <- string_ids %>%
  filter(source == "UniProt_ID") %>% 
  select(string_protein_id, alias)

# There are multiple names mapping to the same STRING entry. We will want to export the UniProt_AC IDs and convert them to the verified SwissProt IDs using the namespace mapper
write_tsv(tibble(string_ids$alias), "Desktop/ProteinWeaver/EscherichiaColi/StringUniProtIDs.txt")
string_uniprot_ids <- read_tsv("Desktop/ProteinWeaver/EscherichiaColi/idmapping_2025_06_24.tsv") %>% select(From, Entry)
string_uniprot_ids <- left_join(string_ids, string_uniprot_ids, by=c("alias" = "From"))

# Filter out potential duplicates introduced by namespace mapping and entries without values
string_uniprot_ids <- string_uniprot_ids %>% filter(!is.na(Entry))
string_uniprot_ids <- string_uniprot_ids %>% distinct(string_protein_id, .keep_all = TRUE)
# Removed 69 proteins

# join the uniprot IDs for protein1
ecoli_ppi <- left_join(ecoli_ppi, string_uniprot_ids, by = c("protein1" = "string_protein_id"), relationship = "many-to-many")

# join the uniprot IDs for protein2
ecoli_ppi <- left_join(ecoli_ppi, string_uniprot_ids, by = c("protein2" = "string_protein_id"), relationship = "many-to-many")

# rename the columns to prepare to merge datasets
colnames(ecoli_ppi) <- c("stringdbID1", "stringdbID2", "evidence", "alias1", "uniprotID1", "alias2", "uniprotID2")
# Add link column for outlink
ecoli_ppi$link <- paste(ecoli_ppi$stringdbID1, ecoli_ppi$stringdbID2, sep = "/")

# Add common names to ppi dataset
string_names <- string_names %>% mutate(protein_name = str_to_upper(str_sub(preferred_name, 1, 1)) %>% 
                          paste0(str_sub(preferred_name, 2)))
string_names <- string_names %>% select(string_protein_id, protein_name)
ecoli_ppi <- left_join(ecoli_ppi, string_names, by = c("stringdbID1"="string_protein_id"))
ecoli_ppi <- left_join(ecoli_ppi, string_names, by = c("stringdbID2"="string_protein_id"))
colnames(ecoli_ppi) <- c("stringdbID1", "stringdbID2", "evidence", "alias1", "uniprotID1", "alias2", "uniprotID2", "link", "name1", "name2")

# Add in source column and export
ecoli_ppi <- ecoli_ppi %>% mutate(source = "string-db")
write_tsv(ecoli_ppi, "Desktop/ProteinWeaver/EscherichiaColi/interactome-txid511145-2025_06_24.txt")

# CREATE THE REG DATA SET
ecoli_reg <- read_tsv("Desktop/ProteinWeaver/EscherichiaColi/NetworkRegulatorGeneEColi.tsv")
regDB_ids <- read_tsv("Desktop/ProteinWeaver/EscherichiaColi/GeneProductAllIdentifiersSetEColi.tsv")

# Get the UniProt IDS for ID conversion
regMapper <- regDB_ids %>% select(geneId, geneName, productId, otherDbsProductsIds)
regMapper <- regMapper %>% mutate(uniprot_id = str_extract(otherDbsProductsIds, "(?<=\\[UNIPROT:)[^\\]]+"))
regMapper <- regMapper %>% select(geneId, geneName, productId, uniprot_id)


# Filter to the strong or confident interactions
ecoli_reg <- ecoli_reg %>% filter(`7)confidenceLevel` == "C" | `7)confidenceLevel` == "S")
# Extract only the useful columns
ecoli_reg <- ecoli_reg %>% select(`1)regulatorId`, `2)regulatorName`, `4)regulatedId`, `5)regulatedName`, `6)function`)
colnames(ecoli_reg) <- c("tf_id", "tf_name", "target_id", "target_name", "activate/repress")
# Change format of TF names to "gene names"
ecoli_reg <- ecoli_reg %>% mutate(tf_name = str_to_lower(str_sub(tf_name, 1, 1)) %>% 
  paste0(str_sub(tf_name, 2)))

# Check missing values and that mapping is working
target_reg <- left_join(ecoli_reg, regMapper, by = c("target_id" = "geneId"))
tf_reg <- left_join(ecoli_reg, regMapper, by = c("tf_name" = "geneName"))

# Merge together the datasets and select the relevant columns
both_reg <- left_join(target_reg, regMapper, by = c("tf_name" = "geneName"))
both_reg <- both_reg %>% select(tf_id, uniprot_id.y, tf_name, target_id, uniprot_id.x, target_name, `activate/repress`)
colnames(both_reg) <- c("tf_id", "tf_uniprot_id", "tf_name", "target_id", "target_uniprot_id", "target_name", "activate/repress")
# Filter out missing UniProt values
both_reg <- both_reg %>% filter(!is.na(tf_uniprot_id)) %>% filter(!is.na(target_uniprot_id))
both_reg <- both_reg %>% mutate(source = "regulonDB")

# We lose 1350 relationships by mapping to UniProt from RegulonDB names
nrow(ecoli_reg) - nrow(both_reg)
sum(is.na(tf_reg$uniprot_id))
sum(is.na(target_reg$uniprot_id))

# Write out regulatory data
write_tsv(both_reg, "Desktop/ProteinWeaver/EscherichiaColi/regulatory-txid511145-2025_06_24.txt")

# GET GO ASSOCIATION DATA
go_df <- read_tsv("Desktop/ProteinWeaver/EscherichiaColi/QuickGO-annotations-1750877966416-20250625.tsv")
colnames(go_df) <- c("database", "uniprot_protein_id", "symbol", "qualifier", "go_term", "go_name", "eco_id", "evidence", "reference")
go_df <- go_df %>% select(uniprot_protein_id, go_term, qualifier)
write_tsv(both_reg, "Desktop/ProteinWeaver/EscherichiaColi/annotations-txid511145-2025_06_24.txt")