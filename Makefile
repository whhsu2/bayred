compile:
	node_modules/less/bin/lessc styles/homeluten.less dest/homeluten-bootstrap.css

minify:
	node_modules/less/bin/lessc -clean-css dest/homeluten-bootstrap.css dest/homeluten-bootstrap.min.css