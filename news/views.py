from rest_framework import generics

from .models import NewsArticle
from .serializers import NewsArticleSerializer


class NewsArticleListView(generics.ListAPIView):
    queryset = NewsArticle.objects.all().order_by('-published_at')
    serializer_class = NewsArticleSerializer


class NewsArticleDetailView(generics.RetrieveAPIView):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer


class NewsArticleByCategoryListView(generics.ListAPIView):
    serializer_class = NewsArticleSerializer

    def get_queryset(self):
        category = self.kwargs['pk']
        return NewsArticle.objects.filter(category__pk=category).order_by('-published_at')
