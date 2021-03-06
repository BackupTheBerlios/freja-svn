<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes" encoding="UTF-8"/>
<xsl:template match="result">
<table border="1" cellpadding="4" cellspacing="4">
<xsl:for-each select="record">
	<tr>
		<td><xsl:value-of select="email" /></td>
		<td>
			<input type="button" value="edit" class="edit">
				<xsl:attribute name="url"><xsl:value-of select="url" /></xsl:attribute>
			</input>
			<input type="button" value="delete" class="delete">
				<xsl:attribute name="url"><xsl:value-of select="url" /></xsl:attribute>
			</input>
		</td>
	</tr>
</xsl:for-each> 
	<tr>
		<td align="right" colspan="2"><input type="button" value="create" class="create" /></td>
	</tr>
</table>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>