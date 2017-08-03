webpackJsonp([13,48],{326:function(e,i){e.exports={rawContent:"\n## Paper\nThis paper provides a unified account of two schools of thinking in information retrieval modelling: the generative retrieval focusing on predicting relevant documents given a query, and the discriminative retrieval focusing on predicting relevancy given a query-document pair. We propose a game theoretical minimax game to iteratively optimise both models. On one hand, the discriminative model, aiming to mine signals from labelled and unlabelled data, provides guidance to train the generative model towards fitting the underlying relevance distribution over documents given the query. On the other hand, the generative model, acting as an attacker to the current discriminative model, generates difficult examples for the discriminative model in an adversarial way by minimising its discrimination objective. With the competition between these two models, we show that the unified framework takes advantage of both schools of thinking: (i) the generative model learns to fit the relevance distribution over documents via the signals from the discriminative model, and (ii) the discriminative model is able to exploit the unlabelled data selected by the generative model to achieve a better estimation for document ranking. Our experimental results have demonstrated significant performance gains as much as 23.96% on Precision@5 and 15.50% on MAP over strong baselines in a variety of applications including web search, item recommendation, and question answering.\n\nhttps://arxiv.org/pdf/1705.10513.pdf\n\n## Implementation\nhttps://github.com/Samurais/irgan",metaData:{layout:"post",title:"IRGAN: A Minimax Game for Unifying Generative and Discriminative Information Retrieval Models",excerpt:"IRGAN for information retrieval, recommend system, QA, and ranking. The generative retrieval focusing on predicting relevant documents given a query, and the discriminative retrieval focusing on predicting relevancy given a query-document pair. ",category:"research",tags:["IRGAN","ranking"],disqus:!0}}}});