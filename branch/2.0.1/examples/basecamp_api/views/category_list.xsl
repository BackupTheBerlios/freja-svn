<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/post-categories">	
	<h3>Message Categories</h3>
	<ul>
		<xsl:apply-templates />
	</ul>
</xsl:template>

<xsl:template match="post-category">	
	<li>
		<a href='#' id='category_{id}' class='editCategoryLink'><xsl:value-of select="name"/></a> (<xsl:value-of select="elements-count"/>)
	</li>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>