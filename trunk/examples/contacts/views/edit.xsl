<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:freja="http://formassembly.com/freja"
>

<xsl:template match="record">	
	<form method="post" action="#" freja:behaviour="form">
	<xsl:attribute name="url"><xsl:value-of select="url" /></xsl:attribute>
		<p><xsl:value-of select="email" /></p>
		<p><input name="record/first_name" type="text" value="{first_name}" /></p>
		<p><input name="record/surname" type="text" value="{surname}" /></p>
		<p>
			<input type="button" value="cancel" freja:behaviour="cancel" />
			<input type="submit" value="ok" />
		</p>
	</form>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>