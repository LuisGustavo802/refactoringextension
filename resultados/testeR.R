csv <- read.table("/Users/bi004822/repos/tcc/resultados/JavaScript/lloc.csv", header=FALSE, sep = ",")

metricaAntes <- as.numeric(csv[,2])
metricaDepois <- as.numeric(csv[,3])

wilcox.test(metricaAntes, metricaDepois, paired = F, alternative = "two.sided", conf.level = 0.95)

max_len = max(length(metricaAntes), length(metricaDepois))
metricaAntes = c(metricaAntes, rep(NA, max_len - length(metricaAntes)))
metricaDepois = c(metricaDepois, rep(NA, max_len - length(metricaDepois)))

my_data <- data.frame(group=rep(c("Métrica Antes", "Métrica Depois"), each=max_len), 
                      weight = c(metricaAntes, metricaDepois))

library(dplyr)
group_by(my_data, group) %>%
  summarise(
    count = n(),
    mean = mean(weight, na.rm = TRUE),
    sd = sd(weight, na.rm = TRUE)
  )

library("ggpubr")
ggboxplot(my_data, x = "group", y = "weight", 
          color = "group", palette = c("#00AFBB", "#E7B800"),
          ylab = "LLOC")



