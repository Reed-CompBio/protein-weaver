library(dplyr)
library(stringr)


#getting ProPro data

yeast_path <- "/Users/abarelvi/rstudio/yeast/BIOGRID-ORGANISM-LATEST.tab3/BIOGRID-ORGANISM-Saccharomyces_cerevisiae_S288c-4.4.235.tab3.txt"
yeast_df <-read.csv(yeast_path, header = TRUE, sep = "\t", quote = "")
yeast_ppi <- data.frame(yeast_df$BioGRID.ID.Interactor.A, yeast_df$BioGRID.ID.Interactor.B, yeast_df$Synonyms.Interactor.A, yeast_df$Synonyms.Interactor.B, yeast_df$Experimental.System.Type, yeast_df$Publication.Source)
yeast_ppi <- yeast_ppi[yeast_ppi$yeast_df.Experimental.System.Type == "physical",]
colnames(yeast_ppi) <- c("id1", "id2","synonym1", "synonym2",  "type", "pubmedid")
yeast_ppi$standard_id1 <- pmin(yeast_ppi$id1, yeast_ppi$id2)
yeast_ppi$standard_id2 <- pmax(yeast_ppi$id1, yeast_ppi$id2)
df_unique <- yeast_ppi[!duplicated(yeast_ppi[, c("standard_id1", "standard_id2")]), ]
df_unique <- df_unique[, !(names(df_unique) %in% c("standard_id1", "standard_id2"))]
yeast_ppi <- df_unique

#filter yeast_ppi data to only include reviewed swissprot proteins
combined_protein_ppi <- c(yeast_ppi$id1,yeast_ppi$id2)
unique_ppi_proteins <- data.frame(unique(combined_protein_ppi))



#getting pro go data

go_path <- "/Users/abarelvi/rstudio/yeast/yeast-go.gpad"
go_df <-read.csv(go_path, header = FALSE, sep = "\t", quote = "")
colnames(go_df) <- c("gene_product", "symbol", "qualifier", "go_term", "evidence", "reference", "with/from", "taxon", "assigned_by", "annotation_extension")
final_yeast_go_annotation <- data.frame( go_df$symbol, go_df$go_term, go_df$qualifier, go_df$evidence, go_df$reference, go_df$annotation_extension)
colnames(final_yeast_go_annotation) <- c("protein", "go_term", "qualifier", "evidence", "reference", "annotation_extension")

# getting list of proteins from both datasets
protein_go_list <- data.frame(unique(final_yeast_go_annotation$protein))
combined_protein_ppi <- c(yeast_ppi$id1,yeast_ppi$id2)
protein_ppi_list <- data.frame(unique(combined_protein_ppi))

# getting namespace mapping between biogrid and uniprot
biogrid <- data.frame(yeast_df$BioGRID.ID.Interactor.A, yeast_df$BioGRID.ID.Interactor.B, yeast_df$Experimental.System.Type)
biogrid <- biogrid[biogrid$yeast_df.Experimental.System.Type == "physical", ]
biogrid_protein_ids <- data.frame(unique(c(biogrid$yeast_df.BioGRID.ID.Interactor.A, biogrid$yeast_df.BioGRID.ID.Interactor.B)))
colnames(biogrid_protein_ids) <- c("biogrid_id")
write.csv(biogrid_protein_ids, "/Users/abarelvi/rstudio/yeast/biogrid_protein_ids.txt", row.names = FALSE)
biogrid_uniprote_path <- "/Users/abarelvi/rstudio/yeast/biogrid_uniprot_yeast_mapping.tsv"
biogrid_to_uniprot <- read.csv(biogrid_uniprote_path, header = TRUE, sep = "\t", quote = "")
id_mapping <- data.frame(biogrid_to_uniprot$From, biogrid_to_uniprot$Entry)
colnames(id_mapping) <- c("biogrid_id", "uniprot_id")




duplicates <- id_mapping %>%
  group_by(biogrid_id) %>%
  summarise(unique_uniprot_ids = n_distinct(uniprot_id)) %>%
  filter(unique_uniprot_ids > 1) %>%
  pull(biogrid_id)

# Remove duplicates
id_mapping <- id_mapping %>%
  filter(!biogrid_id %in% duplicates)

final_id_mapping <- id_mapping %>%
  group_by(uniprot_id) %>%
  slice(1) %>%  # Keeps the first occurrence of each uniprot_id2
  ungroup()

duplicate_uniprot <- final_id_mapping %>%
  group_by(uniprot_id) %>%
  filter(n_distinct(biogrid_id) > 1)

if (nrow(duplicate_uniprot) > 0) {
  print("Some uniprot_id2 values still map to multiple biogrid_id values.")
} else {
  print("Each uniprot_id2 now maps to a unique biogrid_id.")
}


duplicate_biogrid <- final_id_mapping %>%
  group_by(biogrid_id) %>%
  filter(n_distinct(uniprot_id) > 1)

if (nrow(duplicate_biogrid) > 0) {
  print("Some biogrid_id values map to multiple uniprot_id2 values.")
  print(duplicate_biogrid)
} else {
  print("Each biogrid_id maps to a unique uniprot_id2.")
}

# missing # of protein mappings
length(protein_ppi_list$unique.combined_protein_ppi.) - length(final_id_mapping$biogrid_id)

# merge progo data with mapped uniprot ids from ppi biogrid ids
filtered_ppi <- yeast_ppi %>%
  semi_join(final_id_mapping, by = c("id1" = "biogrid_id")) %>%
  semi_join(final_id_mapping, by = c("id2" = "biogrid_id"))

# Perform the first left join
merged_df <- filtered_ppi %>%
  left_join(final_id_mapping, by = c("id1" = "biogrid_id"))

# Rename the columns to avoid conflicts in the second join
final_id_mapping <- final_id_mapping %>%
  rename(uniprot_id2 = uniprot_id)

# Perform the second left join
final_yeast_ppi <- merged_df %>%
  left_join(final_id_mapping, by = c("id2" = "biogrid_id"))

final_yeast_ppi <- final_yeast_ppi %>%
  mutate(
    synonym1 = ifelse(synonym1 == "-", as.character(uniprot_id), synonym1),
    synonym2 = ifelse(synonym2 == "-", as.character(uniprot_id2), synonym2)
  )
colnames(final_yeast_ppi)[colnames(final_yeast_ppi) == "id1"] <- "biogrid_id1"
colnames(final_yeast_ppi)[colnames(final_yeast_ppi) == "id2"] <- "biogrid_id2"
final_yeast_ppi <- final_yeast_ppi %>%
  select(uniprot_id, uniprot_id2, biogrid_id1, biogrid_id2, synonym1, synonym2, pubmedid)

final_yeast_ppi <- final_yeast_ppi %>%
  mutate(synonym1 = str_split(synonym1, "\\|", simplify = TRUE)[, 1])

final_yeast_ppi <- final_yeast_ppi %>%
  mutate(synonym2 = str_split(synonym2, "\\|", simplify = TRUE)[, 1])

final_yeast_ppi <- final_yeast_ppi %>%
  mutate(pubmedid = sub("PUBMED:", "", pubmedid))

colnames(final_yeast_go_annotation)[colnames(final_yeast_go_annotation) == "protein"] <- "uniprot_protein_id"

# number of lost ProPro relationship due to mapping
length(yeast_ppi$id1) - length(final_yeast_ppi$id1)

# check that each entry has an associated ID
na_counts <- colSums(is.na(final_yeast_ppi))
print(na_counts)

# getting regulatory data

tflink_yeast_data <- "/Users/abarelvi/rstudio/yeast/TFLink_Saccharomyces_cerevisiae_interactions_All_simpleFormat_v1.0.tsv"
tflink_df <- read.csv(tflink_yeast_data, header=TRUE, sep="\t")
yeast_reg <- data.frame(tflink_df$UniprotID.TF, tflink_df$UniprotID.Target, tflink_df$Name.TF, tflink_df$Name.Target, tflink_df$Detection.method, tflink_df$PubmedID, tflink_df$Source.database)
colnames(yeast_reg) <- c("tf_id", "target_id", "tf_name", "target_name", "detection", "pubmed", "database")

unique_reg_proteins <- data.frame(unique(c(yeast_reg$tf_id, yeast_reg$target_id)))
write.csv(unique_reg_proteins, "/Users/abarelvi/rstudio/yeast/unique_uniprot_reg_proteins", row.names = FALSE)
reviewed_uniprot_reg_proteins <-read.csv("/Users/abarelvi/rstudio/yeast/reviewed_uniprot_reg_proteins.tsv", header = TRUE, sep = "\t", quote = "")
unique_reviewed_reg_proteins <- unique(c(reviewed_uniprot_reg_proteins$From, reviewed_uniprot_reg_proteins$Entry))

filtered_yeast_reg <- yeast_reg %>%
  filter(tf_id %in% unique_reviewed_reg_proteins & target_id %in% unique_reviewed_reg_proteins)

final_yeast_reg <- filtered_yeast_reg %>%
  mutate(
    tf_name = ifelse(tf_name == "-", as.character(tf_id), tf_name),
    target_name = ifelse(target_name == "-", as.character(target_id), target_name)
  )

write.table(final_yeast_ppi, "/Users/abarelvi/rstudio/yeast/yeast_ppi-2024-08-08.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)
write.table(final_yeast_go_annotation, "/Users/abarelvi/rstudio/yeast/yeast_go_annotation-2024-08-08.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)
write.table(final_yeast_reg, "/Users/abarelvi/rstudio/yeast/yeast_reg-2024-08-08.tsv", sep = "\t", row.names = FALSE, col.names = TRUE, quote = FALSE)

