<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:param name="messageId" ></xsl:param>

<xsl:template match="posts">
	<xsl:apply-templates select="//post[id=$messageId]" />
</xsl:template>

<xsl:template match="post">	
	<form method="post" action="#" id="message__{id}" class="editMessageForm" >
		<label for="posttitle" class="preField">Title: </label>
		<input type="text" name="//post[id='{id}']/title" id="posttitle" value="{title}" /><br/>
		<label for="postbody" class="preField">Body: </label>
		<textarea name="//post[id='{id}']/body" id="postbody">
			<xsl:value-of select="body" />
		</textarea>
		<p>Posted on: <xsl:value-of select="posted-on" /></p>
		<p>
			<input type="hidden" value="false" name="//post[id='{id}']/@synchronized" />
			<input type="button" value="cancel" class="cancelAction" />
			<input type="submit" value="ok" class="primaryAction" />
		</p>
	</form>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>