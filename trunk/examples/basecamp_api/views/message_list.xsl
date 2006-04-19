<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/posts">	
	<ul>
		<xsl:apply-templates />
	</ul>
</xsl:template>

<xsl:template match="post">	
	<li>
		<a href='#' id='post_{id}' class='editPostLink'><xsl:value-of select="title"/></a>
		&#160; <xsl:value-of select="category/name"/>
		<xsl:apply-templates />
	</li>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>