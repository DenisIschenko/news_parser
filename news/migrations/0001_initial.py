# Generated by Django 5.1.7 on 2025-04-02 07:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='NewsArticle',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(db_index=True, max_length=255)),
                ('url', models.URLField(unique=True)),
                ('content', models.TextField()),
                ('source', models.CharField(db_index=True, max_length=100)),
                ('published_at', models.DateTimeField(blank=True, db_index=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='news.category')),
            ],
            options={
                'indexes': [models.Index(fields=['published_at'], name='news_newsar_publish_df29a9_idx'), models.Index(fields=['created_at'], name='news_newsar_created_1d59be_idx'), models.Index(fields=['source', 'published_at'], name='news_newsar_source_f6ea0b_idx')],
            },
        ),
    ]
