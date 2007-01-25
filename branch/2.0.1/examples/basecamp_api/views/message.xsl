<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:param name="messageId" ></xsl:param>
<xsl:param name="title" >Edit Message</xsl:param>
<xsl:template match="posts">
		<xsl:apply-templates select="//post[id=$messageId]" />
</xsl:template>

<xsl:template match="post">	
	<div id="editMessage">
		<h3><xsl:value-of select="$title" /></h3>
		<form method="post" action="#" id="message__{id}" class="editMessageForm" >
			<label for="posttitle" class="preField">Title: </label>
			<input type="text" name="//post[id='{id}']/title" id="posttitle" value="{title}" /><br/>
			
			<xsl:if test="body">
				<label for="postbody" class="preField">Body: </label>
				<textarea name="//post[id='{id}']/body" id="postbody">
					<xsl:value-of select="body" />
				</textarea>
			</xsl:if>
			
			<xsl:if test="not(body)">
				This message is only partially loaded. <a href='#' class='getMessageBodyLink' id='getBody__{id}'>Get Full Message</a>
			</xsl:if>
			
			<p>Posted on: <xsl:value-of select="posted-on" /></p>
			<p>
				<input type="hidden" value="false" name="//post[id='{id}']/@synchronized" />
				<input type="button" value="cancel" class="cancelAction" />
				<input type="submit" value="ok" class="primaryAction" />
			</p>
		</form>
	</div>
	
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>