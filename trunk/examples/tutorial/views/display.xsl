<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="item">	
<div>
	<h3><xsl:value-of select="name" /></h3>
	<p><xsl:value-of select="description" /></p>
	<p><em>Price: <xsl:value-of select="price" /></em></p>
	<p><a href="#" handler="editLink">edit</a></p>
</div>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>