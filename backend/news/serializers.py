from rest_framework import serializers

from .models import NewsArticle, Category


class NewsArticleSerializer(serializers.ModelSerializer):
    # category = serializers.SlugRelatedField(many=False, read_only=True, slug_field='name')
    category = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = NewsArticle
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
