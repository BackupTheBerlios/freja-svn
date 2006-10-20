<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
	<form method="post" action="#" class="form">
		<p>email:<input name="email" type="text" value="" /></p>
		<p>first_name:<input name="first_name" type="text" value="" /></p>
		<p>surname:<input name="surname" type="text" value="" /></p>
		<p>
			<input type="button" value="cancel" class="cancel" />
			<input type="submit" value="ok" />
		</p>
	</form>
</xsl:template>
</xsl:stylesheet>