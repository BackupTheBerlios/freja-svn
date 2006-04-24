<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/posts">	
	<h3>Messages</h3>
	<p><a href='#' class='newMessageLink'>post a new message</a></p>
	<ul>
		<xsl:apply-templates />
	</ul>
</xsl:template>

<xsl:template match="post">	
	<li><a href='#' id='post__{id}' class='editMessageLink'><xsl:value-of select="title"/></a>
		<br/>
		<small>Posted on <xsl:value-of select="posted-on"/> in <xsl:value-of select="category/name"/>
		<xsl:if test="attachments-count>0">
			(<xsl:value-of select="attachments-count"/> attachements)
		</xsl:if>
		</small>
		<xsl:apply-templates />
	</li>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>