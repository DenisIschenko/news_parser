from django.db.models import Count
from rest_framework import generics

from .models import NewsArticle, Category
from .serializers import NewsArticleSerializer, CategorySerializer


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


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.annotate(news_count=Count('newsarticle')) \
            .filter(news_count__gt=0) \
            .order_by('name')
