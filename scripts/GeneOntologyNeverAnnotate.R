# Load the rvest package for web scraping
library(rvest)
library(tidyverse)
setwd("~/Desktop/GitHub_Repos/protein-weaver/data/GeneOntology/")

# URL of the webpage to get the list of GO terms that should never be annotated
url <- 'https://gowiki.tamu.edu/wiki/index.php/Category:GO:gocheck_do_not_manually_annotate'

# Send a GET request to the webpage and parse HTML content
webpage <- read_html(url)

# Find the HTML element containing the desired value
# For example, if you want to extract the text from a <div> element with class="value":
element <- html_nodes(webpage, 'a.ecp_label')

# Extract the values
do_not_annotate <- html_text(element)  # Extract text from the HTML element
do_not_annotate <- substr(do_not_annotate, start = 1, stop = 10)
do_not_annotate <- as_tibble(do_not_annotate)
colnames(do_not_annotate) <- "id"
do_not_annotate <- do_not_annotate %>% mutate(annotated = FALSE)

# Write out the file
write_delim(do_not_annotate, "go_neverAnnotate.txt")

# Join the dataset as a new column
do_not_annotate <- read_delim("go_neverAnnotate.txt")
go_terms <- read_delim("go_2024-07-17.txt")

go_terms <- left_join(go_terms, do_not_annotate)
go_terms["annotated"][is.na(go_terms["annotated"])] <- TRUE

go_terms <- go_terms %>% mutate(never_annotate = case_when(
  annotated == FALSE ~ "true",
  annotated == TRUE ~ "false"
))

# get the second set of do not annotate
gocheck_do_not_annotate <- read_delim("gocheck_do_not_annotate_2024-07-17.txt")
gocheck_do_not_annotate <- gocheck_do_not_annotate %>% mutate(annotated = FALSE, never_annotate = "true")
gocheck_do_not_annotate <- subset(gocheck_do_not_annotate, select = -c(subset, relationship, property_value, alt_id, comment, xref))

go_terms <- rbind(go_terms, gocheck_do_not_annotate)

write_tsv(go_terms, "go_2024-07-17.txt")