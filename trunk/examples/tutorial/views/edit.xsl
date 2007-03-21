<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="item">	
	<form method="post" action="#" class="editForm">
		<h3><input name="item/name" type="text" value="{name}" /></h3>
		<p><textarea name="item/description"><xsl:value-of select="description" /></textarea></p>
		<p><input name="item/price" type="text" value="{price}" /></p>
		<p>
			<a href="#" class="displayLink">display</a>
			<input type="submit" value="ok" />
		</p>
	</form>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>