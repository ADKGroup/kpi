# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import datetime
import jsonbfield.fields
import jsonfield.fields
import kpi.fields


def convert_asset_version_id_to_uid_string(apps, schema_editor):
    AssetSnapshot = apps.get_model("kpi", "AssetSnapshot")
    AssetVersion = apps.get_model("kpi", "AssetVersion")

    for _as in AssetSnapshot.objects.exclude(_asset_version_id_int=None).all():
        _av = AssetVersion.objects.get(_reversion_version_id=_as._asset_version_id_int)
        _as.asset_version_id = _av.uid
        _as.save()


def convert_asset_version_id_back_to_int(apps, schema_editor):
    AssetSnapshot = apps.get_model("kpi", "AssetSnapshot")
    AssetVersion = apps.get_model("kpi", "AssetVersion")

    for _as in AssetSnapshot.objects.exclude(asset_version_id=None).all():
        _av = AssetVersion.objects.get(uid=_as.asset_version_id)
        _as._asset_version_id_int = _av._reversion_version_id
        _as.save()


class Migration(migrations.Migration):

    dependencies = [
        ('reversion', '0002_auto_20141216_1509'),
        ('kpi', '0014_discoverable_subscribable_collections'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssetVersion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uid', kpi.fields.KpiUidField(uid_prefix=b'v')),
                ('name', models.CharField(max_length=255, null=True)),
                ('date_modified', models.DateTimeField(default=datetime.datetime(2010, 1, 1, 0, 0))),
                ('version_content', jsonbfield.fields.JSONField()),
                ('deployed_content', jsonbfield.fields.JSONField(null=True)),
                ('_deployment_data', jsonbfield.fields.JSONField(default=False)),
                ('deployed', models.BooleanField(default=False)),
                ('_reversion_version', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='reversion.Version')),
                ('asset', models.ForeignKey(related_name='asset_versions', to='kpi.Asset')),
            ],
            options={
                'ordering': ['-date_modified'],
            },
        ),
        migrations.AlterField(
            model_name='asset',
            name='summary',
            field=jsonfield.fields.JSONField(default=dict, null=True),
        ),
        # temporarily move old field
        migrations.RenameField(
            model_name='assetsnapshot',
            old_name='asset_version_id',
            new_name='_asset_version_id_int',
        ),
        # add new CharField
        migrations.AddField(
            model_name='assetsnapshot',
            name='asset_version_id',
            field=models.CharField(max_length=32, null=True),
        ),
        # move values from IntegerField to CharField (and reverse)
        migrations.RunPython(
            convert_asset_version_id_to_uid_string,
            convert_asset_version_id_back_to_int,
        ),
        # remove temporary field
        migrations.RemoveField(
            model_name='assetsnapshot',
            name='_asset_version_id_int',
        ),
        migrations.AddField(
            model_name='asset',
            name='graph_styles',
            field=jsonbfield.fields.JSONField(default=dict),
        ),
    ]
