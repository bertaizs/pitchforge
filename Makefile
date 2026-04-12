PNG_DIR := png
JPG_DIR := jpg




upload:
	gcloud config set project revamped-berta-hu
	gcloud app deploy


download_pngs:
	mkdir -p $(PNG_DIR) $(JPG_DIR)
	gsutil -m rsync -r gs://static-files-revamped-berta-hu/raw/ $(PNG_DIR)/

png2jpg:
	foreachfile.py png/ "convert $(PNG_DIR)/%.png $(JPG_DIR)/%.jpg"
	cp $(PNG_DIR)/*.jpg $(JPG_DIR)

upload_jpgs:
	gsutil -m rsync -r $(JPG_DIR)/ gs://static-files-revamped-berta-hu/pics/


