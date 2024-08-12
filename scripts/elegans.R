library(dplyr)
library(tidyverse)


ppi_path <- "/Users/abarelvi/rstudio/elegans/c_elegans.PRJNA13758.current.interactions.txt"
raw_ppi <- read.delim(ppi_path, sep='\t', header= TRUE)
raw_ppi <- raw_ppi %>%
  select(-...) %>%
  select(-Summary)

raw_ppi <- raw_ppi %>%
  filter(Interaction_type == "Physical")

# check that each entry has an associated ID
na_empty_counts <- sapply(raw_ppi, function(x) sum(is.na(x) | x == ""))
print(na_empty_counts)

# remove cases where there is a protein1 but no protein2
raw_ppi <- raw_ppi %>%
  filter(Interactor2 != "")

# check that all proteins are uniprot reviewed
ppi_proteins <- c(raw_ppi$Interactor1, raw_ppi$Interactor2)
unique_ppi_worm_ids <- data.frame(unique(ppi_proteins))
write.csv(unique_ppi_worm_ids, "/Users/abarelvi/rstudio/elegans/unique_ppi_worm_proteins_txt", row.names = FALSE)

# REVIEWED MAPPING
reviewed_ppi_proteins_path <- "/Users/abarelvi/rstudio/elegans/reviewed_ppi_proteins.tsv"
reviewed_ppi_protein_mapping <- read.csv(reviewed_ppi_proteins_path, header = TRUE, sep = "\t")
reviewed_ppi_protein_mapping <- reviewed_ppi_protein_mapping %>%
  mutate(Gene.Names = sapply(str_split(Gene.Names, " "), `[`, 1))
ppi_mapping <- data.frame(reviewed_ppi_protein_mapping$From, reviewed_ppi_protein_mapping$Entry, reviewed_ppi_protein_mapping$Gene.Names)
colnames(ppi_mapping) <- c("worm_id", "uniprot_id", "name")

# remove duplicate interactions 
raw_ppi <- raw_ppi %>%
  # Create a standardized version of the id pairs
  mutate(
    id_pair = ifelse(Interactor1 < Interactor2, paste(Interactor1, Interactor2, sep = "_"), paste(Interactor2, Interactor1, sep = "_"))
  ) %>%
  # Remove duplicates based on the standardized id pairs
  distinct(id_pair, .keep_all = TRUE) %>%
  # Remove the temporary id_pair column
  select(-id_pair)

#many to many mapping
non_unique_mappings <- ppi_mapping %>%
  group_by(worm_id) %>%
  filter(n() > 1)

# Ensure unique mappings in ppi_mapping
ppi_mapping_unique <- ppi_mapping %>%
  distinct(worm_id, .keep_all = TRUE)

# Perform the first left join to map interactor1
raw_ppi_mapped <- raw_ppi %>%
  left_join(ppi_mapping_unique, by = c("Interactor1" = "worm_id")) %>%
  rename(interactor1_uniprot_id = uniprot_id, interactor1_name = name)

# Perform the second left join to map interactor2
raw_ppi_mapped <- raw_ppi_mapped %>%
  left_join(ppi_mapping_unique, by = c("Interactor2" = "worm_id")) %>%
  rename(interactor2_uniprot_id = uniprot_id, interactor2_name = name)

# Filter out rows where interactor1 or interactor2 do not have a mapping
final_reviewed_ppi <- raw_ppi_mapped %>%
  filter(!is.na(interactor1_uniprot_id) & !is.na(interactor2_uniprot_id))

final_reviewed_ppi <- final_reviewed_ppi %>%
  rename(commonName1 =Common.name) %>%
  rename( commonName2 = Common.name.1) %>%
  rename(InteractionId = WBInteractionID)

final_ppi <- raw_ppi %>%
  rename(commonName1 =Common.name) %>%
  rename( commonName2 = Common.name.1) %>%
  rename(InteractionId = WBInteractionID)

unique_rel_type <- unique(final_reviewed_ppi$Interaction_type)
value_count <- table(final_reviewed_ppi$Interaction_type)
print(unique_rel_type)
print(value_count)

write.table(final_ppi, "/Users/abarelvi/rstudio/elegans/elegans_ppi.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)
write.table(final_reviewed_ppi, "/Users/abarelvi/rstudio/elegans/reviewed_elegans_ppi.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)


write.table(final_reviewed_ppi, "/Users/abarelvi/rstudio/elegans/TESTING.tsv", sep="\t", row.names = FALSE, quote = FALSE)
#total number of proteins
proteins <- c(final_ppi$Interactor1, final_ppi$Interactor2)
length(unique(proteins))
#total number of proteins
proteins <- c(final_reviewed_ppi$Interactor1, final_reviewed_ppi$Interactor2)
length(unique(proteins))


# get gene association data
go_path <-  "/Users/abarelvi/rstudio/elegans/c_elegans.PRJNA13758.current.gene_association.wb"
raw_go <- read.csv(go_path, header=FALSE, sep="\t")
colnames(raw_go) <- c("c1", "gene_id", "gene_common_name", "rel_type", "go_id", "reference", "c2", "c3", "c4", "c5", "c6", "c7", "c8","c9", "database", "c10", "c11" )
raw_go <- raw_go %>%
  select(-c5, -c11)
na_empty_counts <- sapply(raw_go, function(x) sum(is.na(x) | x == ""))
print(na_empty_counts)
#remove duplicate entries from multiple databases?
final_go_annotation <- raw_go %>%
  distinct(gene_id, go_id, .keep_all = TRUE)

# REVIEWED MAPPING
go_proteins <- data.frame(unique(final_go_annotation$gene_id))
write.csv(go_proteins, "/Users/abarelvi/rstudio/elegans/raw_go_proteins.txt",  row.names = FALSE)
reviewed_go_proteins_path <- "/Users/abarelvi/rstudio/elegans/reviewed_go_proteins.tsv"
reviewed_go_proteins <- read.csv(reviewed_go_proteins_path, header = TRUE, sep= '\t')
reviewed_go_proteins <- reviewed_go_proteins %>%
  mutate(Gene.Names = sapply(str_split(Gene.Names, " "), `[`, 1))
go_mapping <- data.frame(reviewed_go_proteins$From, reviewed_go_proteins$Entry, reviewed_go_proteins$Gene.Names)
colnames(go_mapping) <- c("worm_id", "uniprot_id", "name")

non_unique_mappings <- go_mapping %>%
  group_by(worm_id) %>%
  filter(n() > 1)

# Ensure unique mappings in ppi_mapping
go_mapping_unique <- go_mapping %>%
  distinct(worm_id, .keep_all = TRUE)

# Perform the first left join to map interactor1
raw_go_mapped <- final_go_annotation %>%
  left_join(go_mapping_unique, by = c("gene_id" = "worm_id"))


# Filter out rows where there is no uniprot_id do not have a mapping
final_reviewed_go <- raw_go_mapped %>%
  filter(!is.na(uniprot_id))

write.table(final_go_annotation, "/Users/abarelvi/rstudio/elegans/elegans_go_annotation.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)
write.table(final_reviewed_go, "/Users/abarelvi/rstudio/elegans/reviewed_elegans_go_annotation.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)



# get regulatory data
reg_path <- "/Users/abarelvi/rstudio/elegans/TFLink_Caenorhabditis_elegans_interactions_All_simpleFormat_v1.0.tsv"
raw_reg <- read.csv(reg_path, header=TRUE, sep="\t")

# get all uniprot proteins in reg data
# use uniprot mapping tool to go from uniprot to wormbase. there will be a many to many mapping
# now use all the wormbase output and turn it into swiss prot
combined_uniprot_ids <- c(raw_reg$UniprotID.Target, raw_reg$UniprotID.Target)
unique_uniprot_ids <- unique(combined_uniprot_ids)
unique_uniprot_df <- data.frame(unique_uniprot_ids)
write.csv(unique_uniprot_df, "/Users/abarelvi/rstudio/elegans/uniprot_tf_ids.tsv", row.names = FALSE)

# NON REVIEWED MAPPING
combined_uniprot_ids <- c(raw_reg$UniprotID.Target, raw_reg$UniprotID.Target)
unique_uniprot_ids <- unique(combined_uniprot_ids)
unique_uniprot_df <- data.frame(unique_uniprot_ids)
write.csv(unique_uniprot_df, "/Users/abarelvi/rstudio/elegans/uniprot_tf_ids.tsv", row.names = FALSE)
uniprot_swiss_path <- "/Users/abarelvi/rstudio/elegans/uniprot_swiss.tsv"
uniprot_swiss_mapping <- read.csv(uniprot_swiss_path, header=TRUE, sep="\t")

id_mapper_path <- "/Users/abarelvi/rstudio/elegans/uniprot_worm_mapping.tsv"
uniprot_worm_mapper <- read.csv(id_mapper_path, header=TRUE, sep="\t")
colnames(uniprot_worm_mapper) <- c("uniprot_id", "wormbase_id")

# Check for duplicate uniprot_id
duplicates <- uniprot_worm_mapper %>%
  filter(duplicated(uniprot_id) | duplicated(uniprot_id, fromLast = TRUE))

# Remove duplicates to ensure uniqueness
uniprot_worm_mapper_unique <- uniprot_worm_mapper %>%
  distinct(uniprot_id, .keep_all = TRUE)

raw_reg_with_tf_wormbase <- raw_reg %>%
  left_join(uniprot_worm_mapper_unique, by = c("UniprotID.TF" = "uniprot_id")) %>%
  rename(wormbase_id_TF = wormbase_id)

# Second left join
raw_reg_with_all <- raw_reg_with_tf_wormbase %>%
  left_join(uniprot_worm_mapper_unique, by = c("UniprotID.Target" = "uniprot_id")) %>%
  rename(wormbase_id_Target = wormbase_id)

# Filter out rows with NA in either wormbase_id_TF or wormbase_id_Target
raw_reg_with_all <- raw_reg_with_all %>%
  filter(!is.na(wormbase_id_TF) & !is.na(wormbase_id_Target))

raw_reg_with_all <- raw_reg_with_all %>%
  mutate(Name.TF = ifelse(Name.TF == "-", wormbase_id_TF, Name.TF)) %>%
  mutate(Name.Target = ifelse(Name.Target == "-", wormbase_id_Target, Name.Target))

final_reg <- raw_reg_with_all %>%
  rename(commonNameTF =Name.TF) %>%
  rename( commonNameTarget = Name.Target)

# REVIEWED MAPPING

uniprot_to_worm_path <- "/Users/abarelvi/rstudio/elegans/uniprot_to_worm.tsv"
uniprot_to_worm_df <- read.csv(uniprot_to_worm_path, header = TRUE, sep ="\t")
worm_ids <- data.frame(uniprot_to_worm_df$To)
write.csv(worm_ids, "/Users/abarelvi/rstudio/elegans/worm_ids.txt", row.names = FALSE)
worm_to_swiss_path <-  "/Users/abarelvi/rstudio/elegans/reviewed_worm_swiss_id.tsv"
worm_swiss_mapping <- read.csv(worm_to_swiss_path, header = TRUE, sep = "\t")
reg_mapping <- data.frame(worm_swiss_mapping$From, worm_swiss_mapping$Entry, worm_swiss_mapping$Gene.Names)
colnames(reg_mapping) <- c("worm_id", "uniprot_id", "name")

non_unique_reg_mappings <- reg_mapping %>%
  group_by(uniprot_id) %>%
  filter(n() > 1)

# Ensure unique mappings in ppi_mapping
reg_mapping_unique <- reg_mapping %>%
  distinct(uniprot_id, .keep_all = TRUE)


merged_df <- raw_reg %>%
  left_join(reg_mapping_unique, by = c("UniprotID.TF" = "uniprot_id")) %>%
  rename(worm_id_TF = worm_id, name_TF = name)

# Perform the second left join
merged_df <- merged_df %>%
  left_join(reg_mapping_unique, by = c("UniprotID.Target" = "uniprot_id")) %>%
  rename(worm_id_Target = worm_id, name_Target = name)

# Filter out rows with no mappings
merged_df <- merged_df %>%
  filter(!is.na(worm_id_TF) & !is.na(worm_id_Target))

final_reviewed_reg <- merged_df %>%
  mutate(name_TF = sapply(str_split(name_TF, " "), `[`, 1)) %>%
  mutate(name_Target = sapply(str_split(name_Target, " "), `[`, 1))
  

write.table(final_reviewed_reg,"/Users/abarelvi/rstudio/elegans/reviewed_elegan_reg.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)
write.table(final_reg, "/Users/abarelvi/rstudio/elegans/elegans_reg.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)

