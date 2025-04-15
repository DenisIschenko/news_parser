from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.core.cache import cache
from django.db.models import Count, F
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics
from rest_framework.response import Response

from .models import NewsArticle, Category
from .serializers import NewsArticleSerializer, CategorySerializer


class NewsArticleListView(generics.ListAPIView):
    queryset = NewsArticle.objects.all().order_by('-created_at')
    serializer_class = NewsArticleSerializer

    def list(self, request, *args, **kwargs):
        cash_key = 'news_list' + self.kwargs.get('pk', '')
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:

            data = cache.get(cash_key)
            if data is None:
                serializer = self.get_serializer(page, many=True)
                data = serializer.data
                cache.set(cash_key, data, timeout=60 * 60)  # 1 година
            return self.get_paginated_response(data)

        data = cache.get(cash_key)
        if data is None:
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data
            cache.set(cash_key, data, timeout=60 * 60)  # 1 година
        return Response(data)


class NewsArticleDetailView(generics.RetrieveAPIView):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer


class NewsArticleByCategoryListView(NewsArticleListView):

    def get_queryset(self):
        category = self.kwargs['pk']
        return NewsArticle.objects.filter(category__pk=category).order_by('-created_at')


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.annotate(news_count=Count('newsarticle')) \
            .filter(news_count__gt=0) \
            .order_by('name')

    def list(self, request, *args, **kwargs):
        data = cache.get('category_list')
        if data is None:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            data = serializer.data
            cache.set('category_list', data, timeout=60 * 60)  # 1 година
        return Response(data)


@extend_schema(
    parameters=[
        OpenApiParameter(
            name='q',
            description='Пошуковий запит (повнотекстовий)',
            required=False,
            type=str,
        ),
    ]
)
class NewsSearchView(generics.ListAPIView):
    serializer_class = NewsArticleSerializer

    def get_queryset(self):
        query = self.request.query_params.get('q')
        queryset = NewsArticle.objects.all()

        if query:
            search_query = SearchQuery(query, config='simple')

            queryset = queryset.annotate(
                vector=SearchVector('title', weight='A', config='simple') +
                       SearchVector('content', weight='B', config='simple')
            ).annotate(
                rank=SearchRank(F('vector'), search_query)
            ).filter(
                vector=search_query  # тепер Django знає, що це — анотоване поле
            ).order_by('-rank')

        return queryset
