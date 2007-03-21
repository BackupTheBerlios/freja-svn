<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes" encoding="UTF-8"/>

<xsl:template match="/milestones">	
	<ul>
		<xsl:apply-templates />
	</ul>
</xsl:template>

<xsl:template match="milestone">	
	<li>
		<a href='#' id='milestone_{id}' class='editDeadlineLink'><xsl:value-of select="title"/></a>
		&#160; <xsl:value-of select="deadline"/>
		<xsl:apply-templates />
	</li>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>