PNG_DIR := png
JPG_DIR := jpg

games: orc mansion stub

orc:
	node tools/populate.js games/orcpie.json template/game_template.html >  www/orcpie/orc_and_pie.html

mansion:
	node tools/populate.js games/mansion.json template/game_template.html >  www/mansion/mansion.html

stub:
	node tools/populate.js games/game_stub.json template/game_template.html >  www/stub/game_stub.html
	
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

test:
	mkdir -p tmp/
	cp *.html *.js *.css *.ico *.png tmp/
	gsutil -m -h "Cache-Control:no-store" rsync -r tmp/  gs://revamped-test.berta.hu/

docs:
	echo docs
