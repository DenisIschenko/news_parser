from django.contrib import admin

from .models import Category, NewsArticle, RSSFeed


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    pass


@admin.register(RSSFeed)
class RSSFeedAdmin(admin.ModelAdmin):
    pass
