from django.urls import path, include
from .views import NewsArticleListView, NewsArticleDetailView, NewsArticleByCategoryListView

urlpatterns = [
    path('news/', include([
        path('', NewsArticleListView.as_view(), name='news-list'),
        path('<pk>/', NewsArticleDetailView.as_view(), name='news-detail'),
        path('category/<pk>/', NewsArticleByCategoryListView.as_view(), name='news-category'),
        ])),
]