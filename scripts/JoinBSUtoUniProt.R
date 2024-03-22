# install.packages("tidyverse")
library(tidyverse)

setwd('~/Desktop/neo4j-test/bsub_data/')

# import the go annotations
# original source: wget 'https://golr-aux.geneontology.io/solr/select?defType=edismax&qt=standard&indent=on&wt=csv&rows=100000&start=0&fl=source,bioentity_internal_id,bioentity_label,qualifier,annotation_class,reference,evidence_type,evidence_with,aspect,bioentity_name,synonym,type,taxon,date,assigned_by,annotation_extension_class,bioentity_isoform&facet=true&facet.mincount=1&facet.sort=count&json.nl=arrarr&facet.limit=25&hl=true&hl.simple.pre=%3Cem%20class=%22hilite%22%3E&hl.snippets=1000&csv.encapsulator=&csv.separator=%09&csv.header=false&csv.mv.separator=%7C&fq=document_category:%22annotation%22&fq=taxon_subset_closure_label:%22Bacillus%20subtilis%20subsp.%20subtilis%20str.%20168%22&facet.field=aspect&facet.field=taxon_subset_closure_label&facet.field=type&facet.field=evidence_subset_closure_label&facet.field=regulates_closure_label&facet.field=isa_partof_closure_label&facet.field=annotation_class_label&facet.field=qualifier&facet.field=annotation_extension_class_closure_label&facet.field=assigned_by&facet.field=panther_family_label&q=*:*'
Bsub_GO_UniProt <- read_tsv("bsub_go_uniprot.tsv")

Bsub_GO_UniProt <- Bsub_GO_UniProt %>% 
  select(uniprot, qualifier, go_term, name)


# import the mapper for BSU and UniProt IDS
BSU_to_UniProt <- read_tsv("subtiwiki.gene.export.2023-10-18.tsv")

BSU_to_UniProt <- BSU_to_UniProt %>% 
  select(locus, `outlinks->uniprot`)

# rename column for joining
colnames(BSU_to_UniProt)[2] <- "uniprot"

# join datasets together
bsub_GO_data <- inner_join(Bsub_GO_UniProt, BSU_to_UniProt, "uniprot", relationship="many-to-many")

# write to csv
write.csv(bsub_GO_data, "bsub_GO_data.csv", row.names = FALSE)