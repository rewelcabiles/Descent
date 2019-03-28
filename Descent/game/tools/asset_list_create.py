import os


def get_asset_names():
	path = "../static/resources/"

	folder = os.fsencode(path)

	assets = {
		"images": [],
		"sound": []
	}

	for file in os.listdir(folder):
		filename = os.fsencode(file)
		if filename.endswith((".png", ".jpg", ".jpeg")):
			assets["images"].append(filename)

	return assets
